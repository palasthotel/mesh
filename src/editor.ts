import events = require('./events');
import undo = require('./undo');
import exceptions = require('./exceptions');
import util = require('./util');
import consts = require('./consts');
import config = require('./config');
import Configuration = config.Configuration;
import view = require('./view');
import dom = require('./dom');

/**
 * Modular HTML5 WYSIWYG Editor.
 */
export class Editor extends events.EventEmitter {
  container: HTMLElement;
  undo: undo.UndoStack<string>;
  conf: Configuration;
  view: view.View;

  constructor(container: HTMLElement, conf: Configuration) {
    super();

    util.requires(container.nodeName === consts.NODE_NAMES.TEXTAREA,
      'not a textarea');

    this.conf = conf;
    this.undo = new undo.UndoStack<string>(conf.undoSize);

    // set the view according to configuration
    if (conf.defaultView === 'contenteditable') {
      this.view = new view.ContentEditableView(this, conf);
      var id = this.container.id;
      var content = util.xmlDecode(container.innerText);
      this.container = document.createElement('div');
      this.setContent(content);
      this.container.contentEditable = 'true'; // make content editable
      dom.replaceNode(container, this.container);
    } else if (conf.defaultView === 'textarea') {
      this.container = container;
      this.view = new view.TextAreaView(this, conf);
    } else {
      throw new exceptions.InvalidConfigurationException('no such view: "'
        + conf.defaultView + '"');
    }
  }

  setContent(html: string): void {
    if (this.view instanceof view.ContentEditableView) {
      this.container.innerHTML = html;
    } else if (this.view instanceof view.TextAreaView) {
      this.container.innerText = html;
    }
  }
}
