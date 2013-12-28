import events = require('./events');
import undo = require('./undo');
import exc = require('./exceptions');
import util = require('./util');
import consts = require('./consts');

/**
 * Modular HTML5 WYSIWYG Editor.
 */
export class Editor extends events.EventEmitter {
  private container: HTMLElement;
  private undo: undo.UndoStack<string>;
  private conf: any;

  constructor(elem: HTMLElement, conf: any) {
    super();

    util.requires(elem.nodeName === consts.NODE_NAMES.TEXTAREA,
      'not a textarea');

    this.container = elem;
    this.conf = conf;
    this.undo = new undo.UndoStack<string>(conf.undoSize);
  }
}
