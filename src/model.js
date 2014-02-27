/**
 * Models of the MVC pattern.
 * 
 * @module model
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

var events = require('events');
var consts = require('./consts.js');
var dom = require('./dom.js');
var util = require('./util.js');
var dataStore = require('./dataStore.js');
var dnd = require('./dnd.js');
var oo = require('./oo.js');

exports.Document = Document;

/**
 * HTML Document.
 * 
 * @class Document
 * @constructor
 * 
 * @param {HTMLElement} elem - surrounding element
 * @param {String} content - content of the document
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function Document(elem, content) {
  EventEmitter.call(this);

  // helper div, will be discarded later on
  var helper = document.createElement('div');
  helper.innerHTML = content;

  var docFragment = document.createDocumentFragment();

  // add handler and controls for every child
  util.forEach(helper.children, function(child) {
    var blockElement = dom.createElement('div', 'block');
    var blockFragment = document.createDocumentFragment();
    var handle = dom.createElement('div', 'handle');
    var controls = dom.createElement('div', 'controls');

    blockFragment.appendChild(handle);
    blockFragment.appendChild(child);
    blockFragment.appendChild(controls);

    blockElement.appendChild(blockFragment);

    // create new block
    new Block(blockElement, this);

    docFragment.appendChild(blockElement);
  });

  elem.appendChild(docFragment);
}

oo.extend(Document, events.EventEmitter);

Document.prototype.length = function() {
  return this.elem.children.length;
};

Document.prototype.getBlock = function(i) {
  return dataStore.get(this.elem.children[i]).block;
};

Document.prototype.insertBlockAt = function(i, newBlock) {
  this.elem.insertBefore(newBlock.elem, this.elem.children[i]);

  this.emit('change');
  this.emit('addblock');
};

Document.prototype.removeBlock = function(i) {
  this.elem.removeChild(this.elem.children[i]);

  this.emit('change');
  this.emit('removeblock');
};

/**
 * Replaces the block at index i by another one.
 */
Document.prototype.replaceBlock = function(i, newBlock) {
  dom.replaceNode(newBlock.elem, this.elem.children[i]);

  this.emit('change');
};

Document.prototype.toHTML = function() {
  var result = '';
  var length = this.length();
  for (var i = 0; i < length; i++) {
    result += this.getBlock(i).toHTML() + '\n';
  }
  return result;
};

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

  this.elem = elem;
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

  dataRef.draggable = dnd.makeDraggable(elem, this.handle);
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
