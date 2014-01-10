import dataStore = require('./dataStore');
import dom = require('./dom');
import model = require('./model');
import util = require('./util');

export function makeSortable(doc: model.Document, options: any): void {
  var handleClass = options.handleClass;

  var placeholder = dom.createElement('div', 'placeholder');

  var blocks = doc.elem.children;
  util.forEach(blocks, (blockElem: HTMLElement) => {
    // make draggable
    var block = <model.Block> dataStore.get(blockElem).block;

    block.handle.contentEditable = 'false';

    dom.addEventListener(block.handle, 'mouseover', (e: MouseEvent) => {
      blockElem.draggable = true;
    });

    dom.addEventListener(block.handle, 'mouseout', (e: MouseEvent) => {
      blockElem.draggable = false;
    });

    dom.addEventListener(blockElem, 'dragstart', (e: DragEvent) => {
      dom.addClass(blockElem, 'moving');
    });

    dom.addEventListener(blockElem, 'dragend', (e: DragEvent) => {
      dom.removeClass(blockElem, 'moving');
    });

    dom.addEventListener(blockElem, 'dragover', (e: DragEvent) => {
      // if we are over the same node, skip
      if (dom.isChildOf(<Node> e.target, blockElem))
        return;

      var dragged = (<Node> e.target).parentNode;

      if (e.preventDefault)
        e.preventDefault();
    });

    dom.addEventListener(blockElem, 'dragenter', (e: DragEvent) => {
      // if we are over the same node, skip
      if (dom.isChildOf(<Node> e.target, blockElem))
        return;

      doc.elem.insertBefore(placeholder, blockElem);
    });

    dom.addEventListener(blockElem, 'drop', (e: DragEvent) => {

    });
  });
}
