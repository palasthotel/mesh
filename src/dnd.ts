import util = require('./util');
import dom = require('./dom');
import dataStore = require('./dataStore');

/**
 * Make an HTMLElement draggable. You can give it an optional handle.
 */
export function makeDraggable(elem: HTMLElement, handle: HTMLElement = elem): void {
  dom.addEventListener(handle, 'mouseover', () => {
    if (!elem.draggable)
      elem.draggable = true;
  });

  dom.addEventListener(handle, 'mouseout', () => {
    if (elem.draggable)
      elem.draggable = false;
  });

  dom.addEventListener(elem, 'dragstart', () => {
    elem.draggable = false;
    elem.style.opacity = '0.5';
  });
}

function isInUpperHalf(event: MouseEvent, elem: HTMLElement): boolean {
  var y = event.pageY - elem.offsetTop;
  var height = elem.offsetHeight;

  console.log(event.pageY, elem.offsetTop, elem.offsetHeight);

  return height / 2 > y;
}

export function makeDroppable(elem: HTMLElement,
  accept: (draggable: HTMLElement) => boolean): void {
  dom.addEventListener(elem, 'drop', (e) => {
    console.log('drop', e);
  });

  var inUpperHalf = true;

  dom.addEventListener(elem, 'dragover', (e: DragEvent) => {
    // TODO Block specific. Looking for a nice solution...
    var dragged = <HTMLElement> (<Node> e.target).parentNode;

    // if we are over the same node, skip
    if (dragged.isSameNode(elem) || !accept(dragged))
      return;

    if (e.preventDefault)
      e.preventDefault();

    e.dataTransfer.dropEffect = 'move';

    // TODO
    var iiuh = isInUpperHalf(e, elem);
    if (iiuh !== inUpperHalf) {
      var placeholder = dom.createElement('div', 'placeholder');
      if (iiuh)
        elem.parentNode.insertBefore(placeholder, elem);
      else {
        var next = elem.nextSibling;
        if (next === null)
          elem.parentNode.appendChild(placeholder);
        else
          elem.parentNode.insertBefore(placeholder, elem);
      }
    }

    return false;
  });

  dom.addEventListener(elem, 'drop', (e: DragEvent) => {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    // See the section on the DataTransfer object.

    return false;
  });

  dom.addEventListener(elem, 'dragend', (e: DragEvent) => {
    console.log('dragend', e);
    var dragged = <HTMLElement> e.target;
    dragged.style.opacity = '1.0';
  });
}


