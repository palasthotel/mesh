import events = require('./events');
import undo = require('./undo');
import exc = require('./exceptions');
import util = require('./util');
import consts = require('./consts');
import config = require('./config');
import Configuration = config.Configuration;
import view = require('./view');


/**
 * Modular HTML5 WYSIWYG Editor.
 */
export class Editor extends events.EventEmitter {
  container: HTMLElement;
  undo: undo.UndoStack<string>;
  conf: Configuration;
  view: view.View;

  constructor(elem: HTMLElement, conf: Configuration) {
    super();

    util.requires(elem.nodeName === consts.NODE_NAMES.TEXTAREA,
      'not a textarea');

    this.container = elem;
    this.conf = conf;
    this.undo = new undo.UndoStack<string>(conf.undoSize);

    // set the view according to configuration
    if (conf.defaultView === 'contenteditable')
      this.view = new view.ContentEditableView(this, conf);
    else if (conf.defaultView === 'textarea')
      this.view = new view.TextAreaView(this, conf);
    else
      throw new exc.InvalidConfigurationException('no such view: "'
        + conf.defaultView + '"');
  }
}
