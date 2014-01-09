import util = require('./util');
import dom = require('./dom');
import dataStore = require('./dataStore');

/**
 * Make an HTMLElement draggable. You can give it an optional handle.
 */
export function makeDraggable(elem: HTMLElement, handle: HTMLElement = elem): Draggable {
  dom.addEventListener(elem, 'mousedown', (e) => {
    elem.draggable = true;
  });

  dom.addEventListener(elem, 'dragstart', (e) => {
    elem.draggable = false;
  });

  return new Draggable(elem, handle);
}

export class Draggable {
  constructor(public elem: HTMLElement, public handle: HTMLElement) {
  }
}
