import consts = require('./consts');
import dom = require('./dom');
import events = require('./events');
import util = require('./util');
import dataStore = require('./dataStore');
import dnd = require('./dnd');

export class Document extends events.EventEmitter {
  constructor(public elem: HTMLElement, content: string = '') {
    super();

    // helper div, will be discarded later on
    var helper = document.createElement('div');
    helper.innerHTML = content;

    var docFragment = document.createDocumentFragment();

    // add handler and controls for every child
    util.forEach(helper.children, (child: HTMLElement) => {
      var blockElement = dom.createElement('div', 'block');
      var blockFragment = document.createDocumentFragment();
      var handle = dom.createElement('div', 'handle');
      var controls = dom.createElement('div', 'controls');

      blockFragment.appendChild(handle);
      blockFragment.appendChild(<HTMLElement> child);
      blockFragment.appendChild(controls);

      blockElement.appendChild(blockFragment);

      // create new block
      new Block(blockElement, this);

      docFragment.appendChild(blockElement);
    });

    elem.appendChild(docFragment);
  }

  length(): number {
    return this.elem.children.length;
  }

  getBlock(i: number): Block {
    return dataStore.get(<HTMLElement> this.elem.children[i]).block;
  }

  insertBlockAt(i: number, newBlock: Block): void {
    this.elem.insertBefore(newBlock.elem, this.elem.children[i]);

    this.emit('change');
    this.emit('addblock');
  }

  removeBlock(i: number): void {
    this.elem.removeChild(this.elem.children[i]);

    this.emit('change');
    this.emit('removeblock');
  }

  /**
   * Replaces the block at index i by another one.
   */
  replaceBlock(i: number, newBlock: Block): void {
    dom.replaceNode(newBlock.elem, this.elem.children[i]);

    this.emit('change');
  }

  toHTML(): string {
    var result = '';
    var length = this.length();
    for (var i = 0; i < length; i++) {
      result += this.getBlock(i).toHTML() + '\n';
    }
    return result;
  }
}

export class Block extends events.EventEmitter {
  public handle: HTMLElement;
  public content: HTMLElement;
  public controls: HTMLElement;

  constructor(public elem: HTMLElement, public doc: Document) {
    super();

    var dataRef = dataStore.get(elem);
    dataRef.block = this;

    this.handle = <HTMLElement> elem.children[0];
    this.content = <HTMLElement> elem.children[1];
    this.controls = <HTMLElement> elem.children[2];

    this.handle.contentEditable = 'false';
    this.controls.contentEditable = 'false';

    // listen on keydown events
    dom.addEventListener(elem, 'keydown', (ev: Event) => {
      this.emit('change');
    });

    dataRef.draggable = dnd.makeDraggable(elem, this.handle);
  }

  toHTML(): string {
    var result = '';
    var content = this.content;

    var tagName: string;
    if (dom.hasType(content, 'DIV'))
      tagName = dom.getFirstClass(content);
    else
      tagName = this.content.tagName.toLowerCase();

    result += '<' + tagName + '>';

    util.forEach(content.childNodes, (node: Node) => {
      result += dom.nodeToXML(node);
    });

    result += '</' + tagName + '>';

    return result;
  }
}
