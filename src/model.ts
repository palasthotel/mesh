import events = require('./events');

export class Document extends events.EventEmitter {
  private blocks: Array<Block>;

  constructor() {
    super();

    this.blocks = [];
  }

  get(i: number) {
    return this.blocks[i];
  }

  set(i: number, block: Block) {
    this.blocks[i] = block;
    this.emit('change');
  }

  append(block: Block): void {
    this.blocks.push(block);
    this.emit('change');
  }

  toHTML(): string {
    return '';
  }

  static fromElement(elem: HTMLElement): Document {
    var doc = new Document();

    var cs = elem.children;
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      // only append HTMLElements; ignore other elements
      if (c instanceof HTMLElement) {
        doc.append(new Block(<HTMLElement> c));
      }
    }

    return doc;
  }

  static fromHTML(html: string): Document {
    var elem = document.createElement('div');
    return Document.fromElement(elem);
  }
}

export class Block extends events.EventEmitter {
  private elem: HTMLElement;

  constructor(elem: HTMLElement) {
    super();

    this.elem = elem;

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
