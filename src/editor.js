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
var oo = require('./oo.js');
var model = require('./model.js');
var util = require('./util.js');
var undo = require('./undo.js');
var view = require('./view.js');

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
 * @param {Object} conf - configuration object
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function Editor(textarea, toolbar, statusbar, conf) {
  events.EventEmitter.call(this);

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

  this._textarea = textarea;
  this._toolbar = toolbar;
  this._statusbar = statusbar;

  this._conf = conf;
  // undoStack
  this._undo = new undo.UndoStack(conf.undoSize);
  this._delayedEdit = null;

  // set the view according to configuration
  if (conf.defaultView === 'textarea') {
    // use the textarea as-is
    this.setView(new view.TextareaView(textarea, conf));
  } else if (conf.defaultView === 'contenteditable') {
    this.setView(new view.ContentEditableView($(textarea).val(), conf));
  } else {
    // unknown case
    throw new exceptions.InvalidConfigurationException('no such view: "'
        + conf.defaultView + '"');
  }

  this._undo.addState(this.getView().getModel().toXML());

  // handle key shortcuts
  var editor = this;
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
};

oo.extend(Editor, events.EventEmitter);

Editor.prototype.onSelect = function onSelect() {
};

Editor.prototype.onEdit = function onEdit(event) {
  // save ref to this (used by callbacks)
  var editor = this;

  // cancel last undo stack change
  if (this._delayedEdit !== null) {
    clearTimeout(this._delayedEdit);
  }

  this._delayedEdit = setTimeout(function delayedEdit() {
    // push the new state to undo stack
    var newState = editor.getView().getModel().toXML();
    editor._undo.addState(newState);
  }, this._conf.undoDelay);
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

  // replace textarea
  if (v instanceof view.ContentEditableView) {
    dom.replaceNode(this._textarea, this._view.getElement());
  }

  // register event listeners
  v.on('select', function(selection) {
    editor.onSelect(selection);
  });

  v.on('edit', function(event) {
    editor.onEdit(event);
  });
};

Editor.prototype.getView = function() {
  return this._view;
};
