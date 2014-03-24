/**
 * @module view
 */

var events = require('events');
var model = require('./model.js');
var dom = require('./dom.js');
var oo = require('./oo.js');
var util = require('./util.js');

exports.EditorView = EditorView;

/**
 * View for an `Editor`.
 * 
 * Should not be instantiated directly.
 * 
 * @constructor
 * @abstract
 */
function EditorView() {
  this._model = null;
}

oo.extend(EditorView, events.EventEmitter);

EditorView.prototype.setModel = function(model) {
  this._model = model;
};

EditorView.prototype.getModel = function() {
  return this._model;
};

exports.TextareaView = TextareaView;

/**
 * Creates a view out of a `<textarea>`.
 * 
 * @param {HTMLElement} textarea - textarea element
 * 
 * @constructor
 * @extends EditorView
 */
function TextareaView(textarea) {
  EditorView.call(this);

  this.setModel(new model.DocumentModel($(textarea).val(), false));
}

// inheritance
oo.extend(TextareaView, EditorView);

// ContentEditableView

exports.ContentEditableView = ContentEditableView;

/**
 * Creates a new view for a `DocumentModel` using a `DIV` with
 * `contenteditable=true`.
 * 
 * @param {String} content - content string
 * @param {Object} conf - configuration object
 * @param {Boolean} [escaped] - determines whether the given content string is
 *                escaped already
 * 
 * @constructor
 * @extends EditorView
 */
function ContentEditableView(content, conf, escaped) {
  EditorView.call(this);

  this.conf = conf;

  this.elem = dom.createElement('div');

  // set contenteditable
  this.elem.contentEditable = true;

  $(this.elem).addClass('mesh-content');

  // initialize with empty selection model
  this.setSelectionModel(new model.SelectionModel(null));

  // create and set document model
  this.setModel(new model.DocumentModel(content, escaped));

  var view = this;

  $(this.elem).sortable({
    axis : 'y',
    handle : '.mesh-handle',
    placeholder : 'mesh-placeholder',
    stop : function stopSort() {
      // remove selection when the document is sorted
      view.deselectAll();
      view.updateModel();
      view.emit('edit');
    }
  });

  // Listen for mouse and keyboard events
  $(this.elem).bind('click keyup', function selectionChange(e) {
    if (e.type === 'keyup' && (e.keyCode < 33 || e.keyCode > 40)) {
      // when the pressed key was not a selection key, sth. has been edited
      // selection keys are the arrow keys, home and end
      if (!e.ctrlKey) {
        view.emit('edit', e);
      }
    } else {
      // selection change
      view.onSelect(rangy.getSelection());
    }
  });
}

// inheritance
oo.extend(ContentEditableView, EditorView);

ContentEditableView.prototype.setModel = function(model) {
  this._model = model;
  this.updateView();
};

ContentEditableView.prototype.onSelect = function(selection) {
  // only single selection is supported, so this is ok
  var range = selection.getRangeAt(0);

  var docModel = this.getModel();
  var size = docModel.length();

  // selected block
  var selected = null;

  // highlight the selected block
  for (var i = 0; i < size; i++) {
    var blockElem = docModel.get(i).getElement();

    $(blockElem.parentNode).removeClass('mesh-focus');

    if (dom.containsNode(blockElem, range.startContainer)) {
      // remember first block
      selected = blockElem;
      $(blockElem.parentNode).addClass('mesh-focus');
    }
  }

  this.setSelectionModel(new model.SelectionModel(selected));
};

/**
 * @returns {HTMLElement}
 */
ContentEditableView.prototype.getElement = function() {
  return this.elem;
};

/**
 * This method gets called whenever the model changed and the changes shall be
 * applied to the view accordingly.
 */
ContentEditableView.prototype.updateView = function() {
  var m = this.getModel();
  var docFrgmt = document.createDocumentFragment();

  $(this.getElement()).find('.mesh-block').remove();

  // build the view
  var size = m.length();
  for (var i = 0; i < size; i++) {
    var blockView = new BlockView(m.get(i), this);

    docFrgmt.appendChild(blockView.getElement());
  }

  this.getElement().appendChild(docFrgmt);
};

/**
 * This method gets called whenever the view changed and the changes shall be
 * applied to the model accordingly.
 */
ContentEditableView.prototype.updateModel = function() {
  var docModel = new model.DocumentModel();
  var blockElems = this.getElement().children;
  var length = blockElems.length;
  for (var i = 0; i < length; i++) {
    docModel.append(new model.BlockModel(blockElems[i].children[0]));
  }
  this._model = docModel;
};

ContentEditableView.prototype.setSelectionModel = function(selectionModel) {
  this.selectionModel = selectionModel;

  this.emit('select');
};

ContentEditableView.prototype.getSelectionModel = function() {
  return this.selectionModel;
};

/**
 * Deselect every
 */
ContentEditableView.prototype.deselectAll = function() {
  rangy.getSelection().removeAllRanges();
  this.setSelectionModel(new model.SelectionModel(null));
  $(this.getElement()).find('.mesh-block').removeClass('mesh-focus');
};

// BLOCK VIEW

exports.BlockView = BlockView;

function BlockView(blockModel, documentView) {
  var wrapper = dom.createElement('div', 'mesh-block');

  // content
  var content = blockModel.getElement();

  // drag handle
  var handle = dom.createElement('div', 'mesh-handle');
  handle.contentEditable = false;
  $(handle).disableSelection();

  // block controls
  var controls = dom.createElement('div', 'mesh-controls');
  controls.contentEditable = false;
  $(controls).disableSelection();

  // remove button
  var remove = dom.createElement('div', 'mesh-remove');
  $(remove).attr('title', 'remove');
  $(remove).click(function onRemoveBlock() {
    $(wrapper).fadeOut(400, function() {
      $(wrapper).remove();

      documentView.updateModel();
      documentView.emit('edit');

      rangy.getSelection().removeAllRanges();

      if (documentView.getModel().length() == 0) {
        // if there is no other content, add an empty paragraph
        var p = document.createElement('p');
        documentView.getModel().append(new model.BlockModel(p));
        documentView.updateView();
      }
    });
  });

  // attribute editor button
  var attrs = dom.createElement('div', 'mesh-attrs');
  $(attrs).attr('title', 'edit attributes');
  $(attrs).click(function onEditBlockAttributes() {
    // TODO show attribute editor
  });

  var code = dom.createElement('div', 'mesh-code');
  $(code).attr('title', 'edit code');
  $(code).click(function onEditBlockCode() {
    // TODO show code editor
  });

  controls.appendChild(remove);
  controls.appendChild(attrs);
  controls.appendChild(code);

  wrapper.appendChild(content);
  wrapper.appendChild(handle);
  wrapper.appendChild(controls);

  this.elem = wrapper;
}

BlockView.prototype.getElement = function() {
  return this.elem;
};
