/**
 * WYSIWYG Editor.
 * 
 * @module editor
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

var dom = require('./dom.js');
var events = require('events');
var model = require('./model.js');
var oo = require('./oo.js');
var undo = require('./undo.js');
var util = require('./util.js');
var view = require('./view.js');
var flickr = require('./content/flickr.js');

exports.Editor = Editor;

/**
 * Modular HTML5 WYSIWYG Editor.
 * 
 * @class Editor
 * @constructor
 * 
 * @param {HTMLElement|String} textarea - textarea or id of a textarea
 * @param {HTMLElement|String} toolbar - toolbar or id of the toolbar
 * @param {HTMLElement|String} statusbar - status bar or id of the status bar
 * @param {HTMLElement} plugins - plugins
 * @param {Object} conf - configuration object
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function Editor(textarea, toolbar, statusbar, plugins, conf) {
  events.EventEmitter.call(this);
  var editor = this;

  if (typeof textarea === 'string') {
    textarea = document.getElementById(textarea);
  }

  if (typeof toolbar === 'string') {
    toolbar = document.getElementById(toolbar);
  }

  if (typeof statusbar === 'string') {
    statusbar = document.getElementById(statusbar);
  }

  util.requires(dom.hasType(textarea, 'TEXTAREA'), 'not a <textarea>');

  this._view = null;

  this._textarea = textarea;
  this._toolbar = toolbar;
  this._statusbar = statusbar;

  this._attrEditor = null;
  this._codeEditor = null;

  if (conf.enableBlockAttrEditor) {
    this._attrEditor = new view.BlockAttrEditorView(dom
        .createDivIfNotFound('mesh-attr-editor'));

    this._attrEditor.on('change', function() {
      editor.attrsChange();
    });
  }

  if (conf.enableBlockCodeEditor) {
    this._codeEditor = dom.createDivIfNotFound('mesh-code-editor');
  }

  this._conf = conf;
  // undoStack
  this._undo = new undo.UndoStack(conf.undoSize);
  this._delayedEdit = null;

  // set the view according to configuration
  if (conf.defaultView === 'textarea') {
    // use the textarea as-is
    this.setView(new view.TextareaView(textarea, conf));
  } else if (conf.defaultView === 'contenteditable') {
    this.setView(new view.ContentEditableView($(textarea).val(), conf, false,
        plugins.blockTypes));
  } else {
    // unknown case
    throw new exceptions.InvalidConfigurationException('no such view: "'
        + conf.defaultView + '"');
  }

  this.getView().getModel().cleanup();

  // save cleaned state
  var cleaned = this.getView().getModel().toXML();
  $(this._textarea).val(cleaned);
  this._undo.addState(cleaned);

  // handle key shortcuts
  $(document).bind('keyup', function(e) {
    if (!e.ctrlKey)
      return;

    // CTRL + Z -> undo
    if (e.keyCode === 90) {
      // CTRL + SHIFT + Z -> redo
      if (e.shiftKey) {
        // default behavior for Macs
        editor.redo();
      } else {
        editor.undo();
      }

      e.preventDefault();
      return false;
    }
    // CTRL + Y -> redo
    else if (e.keyCode == 89) {
      editor.redo();

      e.preventDefault();
      return false;
    }
  });

  this._controls = [];
  var controlPlugins = plugins.controls;
  for (var i = 0; i < controlPlugins.length; i++) {
    this._controls.push(new controlPlugins[i](this));
  }
};

oo.extend(Editor, events.EventEmitter);

Editor.prototype.selectionChange = function selectionChange() {
  // call selectionChange on every control element
  for (var i = 0; i < this._controls.length; i++) {
    var control = this._controls[i];
    control.selectionChange();
  }
};

Editor.prototype.contentChange = function contentChange(event) {
  // save ref to this (used by callbacks)
  var editor = this;

  // cancel last undo stack change
  if (this._delayedEdit !== null) {
    clearTimeout(this._delayedEdit);
  }

  this._delayedEdit = setTimeout(function delayedEdit() {
    var model = editor.getView().getModel();
    model.cleanup();
    // push the new state to undo stack
    var newState = model.toXML();
    $(editor._textarea).val(newState);

    editor._undo.addState(newState);

    // call contentChange on every control element
    for (var i = 0; i < editor._controls.length; i++) {
      var control = editor._controls[i];
      control.contentChange();
    }
  }, this._conf.undoDelay);
};

Editor.prototype.attrsChange = function() {
  var view = this.getView();
  var selModel = view.getSelectionModel();
  var attrEditor = this._attrEditor;

  if (selModel.length !== 1) {
    return;
  }

  var elem = selModel[0].getModel().getElement();
  var attrModel = attrEditor.getModel();

  // remove existing attributes
  dom.removeAllAttributes(elem);

  // set the attributes
  for ( var key in attrModel) {
    $(elem).attr(key, attrModel[key]);
  }

  this.getView().updateView();
  this.getView().emit('edit');
};

Editor.prototype.editBlockAttrs = function() {
  var view = this.getView();
  var selModel = view.getSelectionModel();
  var attrEditor = this._attrEditor;

  if (attrEditor === null || selModel.length !== 1) {
    return;
  }

  var elem = selModel[0].getModel().getElement();
  var attrModel = {};

  util.forEach(elem.attributes, function(attr) {
    attrModel[attr.nodeName] = attr.nodeValue;
  });

  attrEditor.setModel(attrModel);
  attrEditor.setVisible(true);
};

Editor.prototype.undo = function onUndo() {
  this.getView().deselectAll();
  if (this._undo.hasPreviousState()) {
    this.getView().setModel(
        new model.DocumentModel(this._undo.getPreviousState()));
  }
};

Editor.prototype.redo = function onRedo() {
  this.getView().deselectAll();
  if (this._undo.hasNextState()) {
    this.getView().setModel(new model.DocumentModel(this._undo.getNextState()));
  }
};

Editor.prototype.setView = function(v) {
  var editor = this;
  this._view = v;

  this._textarea.spellcheck = this._conf.enableSpellChecking;

  // hide textarea and append view element
  if (v instanceof view.ContentEditableView) {
    var displayValue = 'none';
    if (this._conf.textareaAlwaysVisible) {
      displayValue = 'block';
    }

    $(this._textarea).css('display', displayValue).before(
        this._view.getElement());

    this._view.getElement().spellcheck = this._conf.enableSpellChecking;
  }

  // register event listeners
  v.on('select', function(selection) {
    editor.selectionChange(selection);
  });

  v.on('edit', function(event) {
    editor.contentChange(event);
  });

  v.on('edit-block-attrs', function() {
    editor.editBlockAttrs();
  });

  this.emit('view-change');
};

Editor.prototype.getView = function() {
  return this._view;
};

Editor.prototype.getToolbar = function() {
  return this._toolbar;
};

Editor.prototype.getUndoStack = function() {
  return this._undo;
};

// TODO This is a HACK!
Editor.prototype.initSearch = function(query, submit, results) {
  var $results = $(results);

  $(submit).click(function(e) {
    e.preventDefault();
    $(results).html('');
    search($(query).val(), 1);
  });

  function search(query, page, loadMore) {
    flickr.search(query, {
      page : page
    }, function(err, result) {
      if (err)
        return; // TODO show warning

      try {
        var todo = result.photos.photo.length;
        $(result.photos.photo).each(function() {
          flickr.oembed(this, {}, function(err, data) {
            if (loadMore) {
              loadMore.remove();
              loadMore = null;
            }

            if (err) {
              todo--;
              throw err;
            }

            $results.append(flickr.embedCode(data));

            if (--todo === 0) {
              draggableResults();

              $results.append('<div class="load-more">Load more</div>');
              var btn = $('#mesh-results .load-more');
              btn.bind('click', function() {
                btn.html('...');
                btn.unbind();
                search(query, page + 1, btn);
              });
            }
          });
        });
      } catch (ex) {
        // TODO show warning: unexpected format
        // exception
      } finally {
      }
    });
  }

  function draggableResults() {
    var $results = $('#mesh-results .mesh-block');
    $results.each(function() {
      $(this).draggable({
        connectToSortable : '#mesh-editor-1 div.mesh-content',
        handle : '.mesh-handle',
        helper : 'clone',
        revert : 'invalid',
        containment : $('#container')
      });
    });
  }
};
