/**
 * @module view
 */

var events = require('events');
var dom = require('./dom.js');
var key = require('./key.js');
var model = require('./model.js');
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
 * @param {Boolean} escaped - determines whether the given content string is
 *                escaped already
 * @param {Array<BlockType>} blockTypes - set of possible block types
 * 
 * @constructor
 * @extends EditorView
 */
function ContentEditableView(content, conf, escaped, blockTypes) {
  EditorView.call(this);

  this._conf = conf;

  this._blockTypes = blockTypes;

  this._elem = dom.createElement('div');

  // set contenteditable
  this._elem.contentEditable = true;

  // selection wrapper
  this._wrappedSelection = false;

  $(this._elem).addClass('mesh-content');

  // initialize with empty selection model
  this.setSelectionModel([]);

  // create and set document model
  this.setModel(new model.DocumentModel(content, escaped));

  var view = this;

  $(this._elem).sortable({
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
  function listener(e) {
    if (e.type === 'keyup' && (e.keyCode < 33 || e.keyCode > 40)) {
      // when the pressed key was not a selection key, sth. has been edited
      // selection keys are the arrow keys, home and end
      if (!e.ctrlKey && key.isAlterationKey(e.keyCode)) {
        view.emit('edit', e);
      }
    } else {
      // selection change
      view.selected(rangy.getSelection());
    }
  }

  // listen for mouse clicks globally
  $(document.body).click(function(e) {
    // selection change
    view.selected(rangy.getSelection());
  });

  // listen for local keyup events
  $(this._elem).bind('keyup', function(e) {
    // if the key is an arrow/home/end key or tab
    if (e.keyCode >= 33 && e.keyCode <= 40 || e.keyCode == 9) {
      return view.selected(rangy.getSelection());
    }

    // check whether the key could alter something
    if (!e.ctrlKey && key.isAlterationKey(e.keyCode)) {
      view.emit('edit', e);
    }
  });
}

// inheritance
oo.extend(ContentEditableView, EditorView);

ContentEditableView.prototype.setModel = function(model) {
  this._model = model;
  this.updateView();
};

ContentEditableView.prototype.selected = function(selection) {
  // only single selection is supported, so this is ok
  if (selection.rangeCount === 0) {
    this.setSelectionModel([]);
  }

  var range = selection.getRangeAt(0);

  var docModel = this.getModel();
  var size = docModel.length();

  // is block selected?
  var selected = false;

  var selectionModel = [];

  // highlight the selected block
  for (var i = 0; i < size; i++) {
    var block = docModel.get(i);
    var blockElem = block.getElement();

    if (dom.containsNode(blockElem, range.startContainer)) {
      selected = true;
    }

    if (selected) {
      $(blockElem.parentNode).addClass('mesh-focus');
      selectionModel.push(block);
    } else {
      $(blockElem.parentNode).removeClass('mesh-focus');
    }

    if (dom.containsNode(blockElem, range.endContainer)) {
      selected = false;
    }
  }

  this.setSelectionModel(selectionModel);
};

/**
 * @returns {HTMLElement}
 */
ContentEditableView.prototype.getElement = function() {
  return this._elem;
};

/**
 * This method gets called whenever the model changed and the changes shall be
 * applied to the view accordingly.
 */
ContentEditableView.prototype.updateView = function() {
  var m = this.getModel();
  var docFrgmt = document.createDocumentFragment();

  $(this.getElement()).find('.mesh-block').remove();

  this._blockViews = [];

  // build the view
  var size = m.length();
  for (var i = 0; i < size; i++) {
    var blockView = new BlockView(m.get(i).getElement(), this);

    docFrgmt.appendChild(blockView.getElement());
    this._blockViews.push(blockView);
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

  // Do this to correctly be able to update the model (unwraps wrapped blocks)
  this.setSelectionModel([]);

  for (var i = 0; i < length; i++) {
    docModel.append(new model.BlockModel(blockElems[i].children[0]));
  }
  this._model = docModel;
};

ContentEditableView.prototype.setSelectionModel = function(selectionModel) {
  var oldSelectionModel = this._selectionModel;
  this._selectionModel = selectionModel;

  // if the selection model is longer than 1, wrap the selection
  if (selectionModel.length > 1) {
    // remove selection
    rangy.getSelection().removeAllRanges();

    this._wrappedSelection = true;

    // get array of selected elements
    var selectedElements = [];
    var length = this._selectionModel.length;
    for (var i = 0; i < length; i++) {
      selectedElements.push(selectionModel[i].getElement().parentNode);
    }

    // wrap all selected elements in a new block
    $(selectedElements).wrapAll('<div class="mesh-block"></div>');
    // TODO a bit hacky. Is there another way to get reference to wrapper?
    var wrapper = selectionModel[0].getElement().parentNode.parentNode;

    // add handle and remove control
    addHandleAndControls(wrapper, this, {
      enableBlockAttrEditor : false,
      enableBlockCodeEditor : false
    });
  } else if (this._wrappedSelection) {
    // get selected elements out of old selection model
    var selectedElements = [];
    var length = oldSelectionModel.length;
    for (var i = 0; i < length; i++) {
      selectedElements.push(oldSelectionModel[i].getElement().parentNode);
    }

    // unwrap the selected blocks
    $(selectedElements).unwrap();

    // remove handle and controls
    var children = [].slice.call(this.getElement().children);
    $(children).filter('.mesh-handle, .mesh-controls').remove();

    this._wrappedSelection = false;
  }

  this.emit('select');
};

ContentEditableView.prototype.getSelectionModel = function() {
  return this._selectionModel;
};

/**
 * Deselect all blocks.
 */
ContentEditableView.prototype.deselectAll = function() {
  rangy.getSelection().removeAllRanges();
  this.setSelectionModel([]);
  $(this.getElement()).find('.mesh-block').removeClass('mesh-focus');
};

function addHandleAndControls(wrapper, documentView, conf) {
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
    // remove the element
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
  controls.appendChild(remove);

  if (conf.enableBlockAttrEditor) {
    // attribute editor button
    var attrs = dom.createElement('div', 'mesh-attrs');
    $(attrs).attr('title', 'edit attributes');
    $(attrs).click(function onEditBlockAttributes() {
      documentView.emit('edit-block-attrs');
    });
    controls.appendChild(attrs);
  }

  if (conf.enableBlockCodeEditor) {
    var code = dom.createElement('div', 'mesh-code');
    $(code).attr('title', 'edit code');
    $(code).click(function onEditBlockCode() {
      documentView.emit('edit-block-code');
    });
    controls.appendChild(code);
  }
  wrapper.appendChild(handle);
  wrapper.appendChild(controls);

  return {
    handle : handle,
    controls : controls
  };
}

// BLOCK VIEW

exports.BlockView = BlockView;

function BlockView(model, documentView) {
  var wrapper = dom.createElement('div', 'mesh-block');
  wrapper.appendChild(blockElement);

  var hc = addHandleAndControls(wrapper, documentView, documentView._conf);

  this._elem = wrapper;

  this._content = model.getElement();
  this._handle = hc.handle;
  this._controls = hc.controls;
}

BlockView.prototype.getElement = function() {
  return this._elem;
};

exports.BlockCodeEditorView = BlockCodeEditorView;

function BlockCodeEditorView(elem) {
  this._elem = elem;

  var elem = document.createFragment();
  // TODO
}

BlockCodeEditorView.setModel = function(code) {
  $(this._textarea).val(code);
};

BlockCodeEditorView.getModel = function() {
  $(this._textarea).val();
};
