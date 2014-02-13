import events = require('./events');
import undo = require('./undo');
import exceptions = require('./exceptions');
import util = require('./util');
import consts = require('./consts');
import config = require('./config');
import dom = require('./dom');
import model = require('./model');
import dataStore = require('./dataStore');
import plugin = require('./plugins/plugin');

/**
 * Modular HTML5 WYSIWYG Editor (Controller).
 */
export class Editor extends events.EventEmitter {
  public content: HTMLElement;
  public undo: undo.UndoStack<string>;

  // IMPORTANT this attribute can be null!
  doc: model.Document = null;

  constructor(content: HTMLElement, public toolbar: HTMLElement,
    plugins: Array<plugin.Plugin>, public buttons: Array<plugin.Button> public conf: config.Configuration) {
    super();

    util.requires(content.nodeName === 'TEXTAREA',
      'not a textarea');

    this.conf = conf;
    this.undo = new undo.UndoStack<string>(conf.undoSize);

    // set the view according to configuration
    if (conf.defaultView === 'textarea') {
      // use the textarea as-is
      this.content = content;
      // hide toolbar
      this.toolbar.style.display = 'none';
    } else if (conf.defaultView === 'contenteditable') {
      // use the id of the textarea as the new id of the container
      var id = content.id;
      this.content = document.createElement('div');
      this.content.id = id;

      // decode the existing content of the textarea
      this.setContent(util.xmlDecode(content.textContent));

      // replace the container node
      dom.replaceNode(content, this.content);

      // make content editable
      this.content.contentEditable = 'true';
    } else {
      // unknown case
      throw new exceptions.InvalidConfigurationException('no such view: "'
        + conf.defaultView + '"');
    }

    // save a ref to this editor
    dataStore.get(this.content).editor = this;

    var delayedUndoID: number;
    // on every change of the content, push a new state to the undo stack
    this.doc.addListener('change', () => {
      delayedUndoID = setTimeout(() => {
        var content = this.getContent();
        this.undo.pushState(content);
      }, conf.undoDelay);
    });

    // install plugins
    util.forEach(plugins, (p: plugin.Plugin) => {
      p.installPlugin(this);
    });

    // emit change event after a short delay
    setTimeout(() => {
      this.doc.emit('change');
    }, 0);
  }

  setContent(content: string): void {
    if (dom.hasType(this.content, 'TEXTAREA')) {
      // straight forward
      this.content.textContent = content;
    } else {
      this.setDocument(new model.Document(this.content, content, this.conf));
    }
  }

  setDocument(doc: model.Document): void {
    this.doc = doc;
  }

  getDocument(): model.Document {
    return this.doc;
  }

  getContent(): string {
    if (dom.hasType(this.content, 'TEXTAREA')) {
      return this.content.textContent;
    } else {
      return this.content.innerHTML;
    }
  }
}
