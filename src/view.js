/**
 * @module view
 */

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

EditorView.prototype.setModel = function(doc) {
  this.model = doc;
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
 * @param {Boolean} [escaped] - determines whether the given content string is
 *                escaped already
 * 
 * @constructor
 * @extends EditorView
 */
function ContentEditableView(content, escaped) {
  EditorView.call(this);

  this.setModel(new model.DocumentModel(content, escaped));

  this.elem = dom.createElement('div');

  // set contenteditable
  $(this.elem).attr('contenteditable', true);
  $(this.elem).addClass('mesh-content');

  this.updateView();
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
  var doc = this.getModel().doc;
  var length = this.getModel().length();

  var docFrgmt = document.createDocumentFragment();

  // add handler and controls for every block
  util.forEach(doc.children, function(child) {
    var blockElem = dom.createElement('div', 'block');
    var blockFrgmt = document.createDocumentFragment();
    var handle = dom.createElement('div', 'handle');
    handle.contentEditable = false;
    var controls = dom.createElement('div', 'controls');

    blockFrgmt.appendChild(handle);
    blockFrgmt.appendChild(child);
    blockFrgmt.appendChild(controls);

    blockElem.appendChild(blockFrgmt);

    // create new block
    // new Block(blockElem, this);

    docFrgmt.appendChild(blockElem);
  });

  this.getElement().appendChild(docFrgmt);

  $(this.getElement()).sortable({
    handle : '.handle',
    placeholder : 'placeholder',
    axis: 'y'
  });
};
