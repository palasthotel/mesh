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
var view = require('./view.js');

exports.Editor = Editor;

/**
 * Modular HTML5 WYSIWYG Editor.
 * 
 * @class Editor
 * @constructor
 * 
 * @param {HTMLElement|String} textarea - textarea or id of a textarea
 * @param {Object} conf - configuration object
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function Editor(textarea, conf) {
  events.EventEmitter.call(this);

  if (typeof textarea === 'string') {
    textarea = document.getElementById(textarea);
  }

  util.requires(dom.hasType(textarea, 'TEXTAREA'), 'not a <textarea>');

  this._textarea = textarea;

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
};

oo.extend(Editor, events.EventEmitter);

Editor.prototype.onSelect = function onSelect() {
};

Editor.prototype.onEdit = function onEdit(event) {
  var editor = this;

  // cancel last undo stack change
  if (this._delayedEdit !== null) {
    clearTimeout(this._delayedEdit);
  }

  this._delayedEdit = setTimeout(function delayedEdit() {
    console.log(editor.getView().getModel().toXML());
  }, this._conf.undoDelay);
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
