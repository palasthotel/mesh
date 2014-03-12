/**
 * Models of the MVC pattern.
 * 
 * @module model
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

var events = require('events');
var dom = require('./dom.js');
var util = require('./util.js');
var oo = require('./oo.js');

exports.DocumentModel = DocumentModel;

/**
 * HTML Document.
 * 
 * @class Document
 * @constructor
 * 
 * @param {String} content - content of the document
 * @param {Boolean} [escaped=false] - is the given `content` XML escaped?
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function DocumentModel(content, escaped) {
  events.EventEmitter.call(this);

  this.doc = document.createElement('div');

  if (escaped) {
    this.doc.innerHTML = util.xmlDecode(content);
  } else {
    this.doc.innerHTML = content;
  }
  
  console.log(this.doc);
}

// inheritance
oo.extend(DocumentModel, events.EventEmitter);

DocumentModel.prototype.length = function() {
  return this.doc.children.length;
};

DocumentModel.prototype.get = function(i) {
  return this.doc.children[i];
};

DocumentModel.prototype.insertAt = function(i, newBlock) {
  this.doc.insertBefore(newBlock.elem, this.doc.children[i]);

  this.emit('change');
};

DocumentModel.prototype.remove = function(child) {
  this.doc.removeChild(child);

  this.emit('change');
};

/**
 * Replaces the block at index i by another one.
 */
DocumentModel.prototype.replace = function(oldChild, newChild) {
  dom.replaceNode(oldChild, newChild);

  this.emit('change');
};

DocumentModel.prototype.toXML = function() {
  var result = '';
  var length = this.length();
  for (var i = 0; i < length; i++) {
    result += dom.nodeToXML(this.get(i));
  }
  return result;
};

// BLOCK

exports.Block = Block;

/**
 * Document Block (e.g. paragraph, figure, ...).
 * 
 * @class Block
 * @constructor
 * 
 * @param {HTMLElement} elem - surrounding element
 * @param {Document} doc - parent document
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function Block(elem, doc) {
  events.EventEmitter.call(this);

  this.doc = elem;
  this.doc = doc;

  var dataRef = dataStore.get(elem);
  dataRef.block = this;

  this.handle = elem.children[0];
  this.content = elem.children[1];
  this.controls = elem.children[2];

  this.handle.contentEditable = 'false';
  this.controls.contentEditable = 'false';

  // listen on keydown events
  dom.addEventListener(elem, 'keydown', function(ev) {
    this.emit('change');
  });

  // dataRef.draggable = dnd.makeDraggable(elem, this.handle);
};

oo.extend(Block, events.EventEmitter);

Block.prototype.toHTML = function() {
  var result = '';
  var content = this.content;

  var tagName;
  if (dom.hasType(content, 'DIV'))
    tagName = dom.getFirstClass(content);
  else
    tagName = this.content.tagName.toLowerCase();

  result += '<' + tagName + '>';

  util.forEach(content.childNodes, function(node) {
    result += dom.nodeToXML(node);
  });

  result += '</' + tagName + '>';

  return result;
};
