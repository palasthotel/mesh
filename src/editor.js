/**
 * WYSIWYG Editor.
 * 
 * @module editor
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

var events = require('events');
var dom = require('./dom.js');
var oo = require('./oo.js');
var util = require('./util.js');
var undo = require('./undo.js');

exports.Editor = Editor;

/**
 * Modular HTML5 WYSIWYG Editor.
 * 
 * @class Editor
 * @constructor
 * 
 * @param {HTMLElement} container - surrounding element
 * @param {Object} conf - configuration
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function Editor(container, conf) {
  EventEmitter.call(this);

  util.requires(dom.hasType(container, 'TEXTAREA'), 'not a <textarea>');

  this.conf = conf;
  // undoStack
  this.undo = new undo.UndoStack(conf.undoSize);

  // set the view according to configuration
  if (conf.defaultView === 'textarea') {
    // use the textarea as-is
    this.elem = container;
  } else if (conf.defaultView === 'contenteditable') {
    // use the id of the textarea as the new id of the container
    var id = container.id;
    this.elem = document.createElement('div');
    this.elem.id = id;

    // decode the existing content of the textarea
    var content = util.xmlDecode(container.textContent);
    this.setContent(content);

    // replace the container node
    dom.replaceNode(container, this.elem);

    // make content editable
    this.elem.contentEditable = 'true';
  } else {
    // unknown case
    throw new exceptions.InvalidConfigurationException('no such view: "'
        + conf.defaultView + '"');
  }

  // save a ref to this editor
  dataStore.get(this.elem).editor = this;

  // on every change of the content, push a new state to the undo stack
  this.addListener('change', function() {
    var content = this.getContent();
    this.undo.pushState(content);
  });

  // emit change event after a short delay
  setTimeout(function() {
    this.emit('change');
  }, 0);
};

/**
 * Checks, whether the view of this editor is the given `viewType`.
 * 
 * @param {String} viewType - view type of interest, either `'textarea'` or
 *                `'contenteditable'`
 * 
 * @returns {Boolean}
 */
Editor.prototype.isView = function(viewType) {
  if (viewType === 'textarea') {
    return dom.hasType(this.elem, 'TEXTAREA');
  } else if (viewType === 'contenteditable') {
    return dom.hasType(this.elem, 'DIV');
  }

  return false;
};

/**
 * Set the editor's contents.
 * 
 * @param {String} content - HTML string
 */
Editor.prototype.setContent = function(content) {
  if (this.isView('textarea')) {
    // straight forward
    this.elem.textContent = content;
  } else {
    this.setDocument(new model.Document(this.elem, content));
  }

  this.emit('change');
};

/**
 * Get the editor's contents.
 * 
 * @returns {String}
 */
Editor.prototype.getContent = function() {
  if (this.isView('textarea')) {
    return this.elem.textContent;
  } else {
    return this.elem.innerHTML;
  }
};

/**
 * Set the editor's document.
 * 
 * @param {Document} doc - document
 */
Editor.prototype.setDocument = function(doc) {
  this.doc = doc;
};

/**
 * Get the editor's document.
 * 
 * @returns {Document}
 */
Editor.prototype.getDocument = function() {
  return this.doc;
};
