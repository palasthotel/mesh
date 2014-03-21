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

  var blocks = this.blocks = [];
  var blocksDiv = document.createElement('div');

  if (escaped) {
    blocksDiv.innerHTML = util.xmlDecode(content);
  } else {
    blocksDiv.innerHTML = content;
  }

  util.forEach(blocksDiv.children, function(child) {
    blocks.push(new BlockModel(child));
  });
}

// inheritance
oo.extend(DocumentModel, events.EventEmitter);

DocumentModel.prototype.length = function() {
  return this.blocks.length;
};

DocumentModel.prototype.get = function(i) {
  return this.blocks[i];
};

DocumentModel.prototype.set = function(i, block) {
  this.blocks[i] = block;
};

DocumentModel.prototype.remove = function(i) {
  delete this.blocks[i];

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

exports.BlockModel = BlockModel;

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
function BlockModel(elem) {
  events.EventEmitter.call(this);

  this.elem = elem;
};

oo.extend(BlockModel, events.EventEmitter);

BlockModel.prototype.getElement = function() {
  return this.elem;
};

BlockModel.prototype.setElement = function(elem) {
  this.elem = elem;

  this.emit('change');
};

BlockModel.prototype.toXML = function() {
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

exports.BlockSelectionModel = BlockSelectionModel;

function BlockSelectionModel(selected) {
  this.selected = selected;
}

BlockSelectionModel.prototype.isEmpty = function() {
  return this.selected === null;
};

BlockSelectionModel.prototype.getSelectedBlock = function() {
  return this.selected;
};
