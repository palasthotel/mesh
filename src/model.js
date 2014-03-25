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
 * @param {String} [content] - content of the document
 * @param {Boolean} [escaped=false] - is the given `content` XML escaped?
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function DocumentModel(content, escaped) {
  events.EventEmitter.call(this);

  var blocks = this._blocks = [];

  if (typeof content == 'undefined' || content === null) {
    return; // if there's no content, leave blocks empty
  }

  var initHelper = document.createElement('div');
  if (escaped) {
    initHelper.innerHTML = util.xmlDecode(content);
  } else {
    initHelper.innerHTML = content;
  }

  util.forEach(initHelper.children, function(child) {
    blocks.push(new BlockModel(child));
  });
}

DocumentModel.prototype.length = function() {
  return this._blocks.length;
};

DocumentModel.prototype.get = function(i) {
  return this._blocks[i];
};

DocumentModel.prototype.set = function(i, block) {
  this._blocks[i] = block;
};

DocumentModel.prototype.append = function(block) {
  this._blocks.push(block);
};

DocumentModel.prototype.remove = function(i) {
  var newBlocks = [];

  for (var j = 0; j < this._blocks.length; j++) {
    if (j != i) {
      newBlocks.push(this._blocks[j]);
    }
  }

  this._blocks = newBlocks;
};

DocumentModel.prototype.cleanup = function() {
  for (var i = 0; i < this._blocks.length; i++) {
    this._blocks[i].cleanup();
  }
};

DocumentModel.prototype.toXML = function() {
  var result = '';
  var length = this.length();
  for (var i = 0; i < length; i++) {
    result += this.get(i).toXML();
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

  this._elem = elem;

  // empty models get a single <br> so they have at least one line
  if (elem.innerHTML == '') {
    elem.innerHTML = '<br/>';
  }
};

oo.extend(BlockModel, events.EventEmitter);

BlockModel.prototype.getElement = function() {
  return this._elem;
};

BlockModel.prototype.setElement = function(elem) {
  dom.replaceNode(this._elem, elem);
  this._elem = elem;

  this.emit('change');
};

BlockModel.prototype.cleanup = function() {
  this.setElement(dom.cleanupElement(this.getElement()));
};

BlockModel.prototype.toXML = function() {
  var result = '';

  return dom.nodeToXML(this.getElement()) + '\n';
};
