import util = require('./util');
import dom = require('./dom');

var defaultConf = {
  dragClass: 'drag',
  overClass: 'drag-over',
  droppableClass: 'droppable',
  notDroppableClass: 'not-droppable'
};

export function draggable(elem: HTMLElement, config: {}) {
  var conf: any = util.extend(defaultConf, config);

  elem.setAttribute('draggable', 'true');

  elem.addEventListener('dragstart', (e) => {
    console.log('start', e.target);
    elem.style.color = '#555';
    dom.addClass(elem, conf.dragClass);
  });

  elem.addEventListener('dragenter', (e) => {
    console.log('enter', e.target);
  });

  elem.addEventListener('dragleave', (e) => {
    console.log('leave', e.target);
  });

  // dragstart
  // drag
  // dragenter
  // dragleave
  // dragover
  // drop
  // dragend
}

export class Draggable {
  private elem: HTMLElement;
  private enabled = true;

  constructor(elem: HTMLElement) {
    elem.setAttribute('draggable', 'true');
    elem.addEventListener('dragstart', this.onDragStart);
    elem.addEventListener('dragend', this.onDragEnd);
  }

  private onDragStart(e: DragEvent): void {
    console.log(e);
  }

  private onDragEnd(e: DragEvent): void {
    console.log(e);
  }
}

export class Droppable {
  private elem: HTMLElement;
  private enabled = true;

  constructor(elem: HTMLElement) {
    this.elem = elem;
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
  }
}
