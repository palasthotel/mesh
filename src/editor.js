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
 * @param {HTMLElement|String} container - surrounding element or id of the
 *                surrounding element
 * @param {Object} conf - configuration object
 * 
 * @extends EventEmitter
 * 
 * @since 0.0.1
 */
function Editor(container, conf) {
  events.EventEmitter.call(this);

  if (typeof container === 'string') {
    container = document.getElementById(container);
  }

  util.requires(dom.hasType(container, 'TEXTAREA'), 'not a <textarea>');

  this.conf = conf;
  // undoStack
  this.undo = new undo.UndoStack(conf.undoSize);

  // set the view according to configuration
  if (conf.defaultView === 'textarea') {
    // use the textarea as-is
    this.view = new view.TextareaView(container);
  } else if (conf.defaultView === 'contenteditable') {
    this.view = new view.ContentEditableView($(container).val());
    dom.replaceNode(container, this.view.getElement());
  } else {
    // unknown case
    throw new exceptions.InvalidConfigurationException('no such view: "'
        + conf.defaultView + '"');
  }
};

oo.extend(Editor, events.EventEmitter);
