import events = require('./events');
import undo = require('./undo');
import exceptions = require('./exceptions');
import util = require('./util');
import consts = require('./consts');
import config = require('./config');
import Configuration = config.Configuration;
import dom = require('./dom');
import model = require('./model');
import dataStore = require('./dataStore');

/**
 * Modular HTML5 WYSIWYG Editor (Controller).
 */
export class Editor extends events.EventEmitter {
  elem: HTMLElement;
  undo: undo.UndoStack<string>;
  conf: Configuration;

  // IMPORTANT this attribute can be null!
  doc: model.Document = null;

  constructor(container: HTMLElement, conf: Configuration) {
    super();

    util.requires(container.nodeName === 'TEXTAREA',
      'not a textarea');

    this.conf = conf;
    this.undo = new undo.UndoStack<string>(conf.undoSize);

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
    this.addListener('change', () => {
      var content = this.getContent();
      this.undo.pushState(content);
    });

    // emit change event after a short delay
    setTimeout(() => {
      this.emit('change');
    }, 0);
  }

  setContent(content: string): void {
    if (dom.hasType(this.elem, 'TEXTAREA')) {
      // straight forward
      this.elem.textContent = content;
    } else {
      this.setDocument(new model.Document(this.elem, content));
    }

    this.emit('change');
  }

  setDocument(doc: model.Document): void {
    this.doc = doc;
  }

  getDocument(): model.Document {
    return this.doc;
  }

  getContent(): string {
    if (dom.hasType(this.elem, 'TEXTAREA')) {
      return this.elem.textContent;
    } else {
      return this.elem.innerHTML;
    }
  }
}
