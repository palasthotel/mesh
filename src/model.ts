import dom = require('./dom');
import events = require('./events');
import util = require('./util');
import dataStore = require('./dataStore');

export class Document extends events.EventEmitter {
  constructor(private elem: HTMLElement, content: string = '') {
    super();

    var helper = document.createElement('div');
    helper.innerHTML = content;

    util.forEach(helper.children, (child) => {
      if (child instanceof HTMLElement) {
        // only append HTMLElements; ignore others
        var blockElement = dom.createElement('div', 'block');
        var handle = dom.createElement('div', 'handle');
        var controls = dom.createElement('div', 'controls');

        blockElement.appendChild(handle);
        blockElement.appendChild(<HTMLElement> child);
        blockElement.appendChild(controls);
      }
    });
  }

  getBlock(i: number): Block {
    return dataStore.get(<HTMLElement> this.elem.children[0]).block;
  }

  insertBlockAt(i: number, newBlock: Block): void {
    this.elem.insertBefore(newBlock.elem, this.elem.children[i]);
  }

  removeBlock(i: number): void {
    this.elem.removeChild(this.elem.children[i]);
  }

  replaceBlock(i: number, newBlock: Block): void {
    this.elem.replaceChild(newBlock.elem, this.elem.children[i]);
  }

  toHTML(): string {
    return '';
  }
}

export class Block extends events.EventEmitter {
  constructor(public elem: HTMLElement) {
    super();

    dataStore.get(elem).block = this;

    var changeEventListener = (ev: Event) => {
      this.emit('change');
    };

    elem.addEventListener('change', changeEventListener);
    elem.addEventListener('keydown', changeEventListener);
  }

  toHTML(): string {
    var result = '';
    var e = this.elem;

    result += '<';
    result += e.nodeName.toLowerCase();
    result += '>';
    result += e.innerHTML;
    result += '</';
    result += e.nodeName.toLowerCase();
    result += '>';

    return result;
  }
}
