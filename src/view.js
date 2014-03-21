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
  this.model = null;
}

oo.extend(EditorView, events.EventEmitter);

EditorView.prototype.setModel = function(model) {
  this.model = model;
};

EditorView.prototype.getModel = function() {
  return this.model;
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

  // create and set document model
  this.setModel(new model.DocumentModel(content, escaped));

  // initialize with empty selection model
  this.setSelectionModel(new model.BlockSelectionModel(null, null));

  this.elem = dom.createElement('div');

  // set contenteditable
  this.elem.contentEditable = true;

  $(this.elem).addClass('mesh-content');

  this.updateView();
  var view = this;

  $(this.elem).sortable({
    axis : 'y',
    handle : '.mesh-handle',
    placeholder : 'mesh-placeholder',
    stop : function stopSort() {
      rangy.getSelection().removeAllRanges();
      view.updateModel();
    }
  });

  // Update the selection model on click and keyup
  $(this.elem).bind('click keyup', function selectionChange(e) {
    if (e.type === 'keyup' && e.keyCode < 33 && e.keyCode > 40) {
      // when the pressed key was not a selection key, return
      // selection keys are the arrow keys, home and end
      return;
    }

    // get the selection
    var selection = rangy.getSelection();

    // only single selection is supported, so this is ok
    var range = selection.getRangeAt(0);

    var m = view.getModel();
    var size = m.length();

    // first and last selected block
    var first = null, last = null;

    // highlight all selected blocks
    for (var i = 0; i < size; i++) {
      var blockElem = m.get(i).getElement();

      if (dom.containsNode(blockElem, range.startContainer)) {
        // remember first block
        first = blockElem;
      }

      // if we didn't find the first block yet, skip to next block
      if (first === null) {
        continue;
      }

      if (dom.containsNode(blockElem, range.endContainer)) {
        // remember last block
        last = blockElem;
      }
    }

    // set size and position of the block handle
    if (!first || !last) {
      return;
    }

    view.setSelectionModel(new model.BlockSelectionModel(first, last));
  });
}

// inheritance
oo.extend(ContentEditableView, EditorView);

/**
 * @returns {HTMLElement}
 */
ContentEditableView.prototype.getElement = function() {
  return this.elem;
};

ContentEditableView.prototype.updateView = function() {
  var m = this.getModel();
  var docFrgmt = document.createDocumentFragment();

  // build the view
  var size = m.length();
  for (var i = 0; i < size; i++) {
    var block = dom.createElement('div', 'mesh-block');

    // content
    var blockContent = m.get(i).getElement();
    block.appendChild(blockContent);

    // handle
    var blockHandle = dom.createElement('div', 'mesh-handle');
    blockHandle.contentEditable = false;
    $(blockHandle).disableSelection();
    block.appendChild(blockHandle);

    // controls
    block.appendChild(dom.createElement('div', 'mesh-controls'));

    docFrgmt.appendChild(block);
  }

  this.getElement().appendChild(docFrgmt);
};

ContentEditableView.prototype.setSelectionModel = function(selectionModel) {
  this.selectionModel = selectionModel;

  this.emit('selection');
};

ContentEditableView.prototype.getSelectionModel = function() {
  return this.selectionModel;
};
