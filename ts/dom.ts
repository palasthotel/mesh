import consts = require('./consts');

/**
 * DOM ready.
 */
export function ready(callback: () => void): void {
  if (/in/.test(document.readyState))
    setTimeout(ready, 9, callback);
  else
    callback();
}

/**
 * Checks, whether a node is an element.
 */
export function isElement(node: Node): boolean {
  return node.nodeType === consts.NODE_TYPES.ELEMENT;
}

/**
 * Checks, whether a node is a text node.
 */
export function isTextNode(node: Node): boolean {
  return node.nodeType === consts.NODE_TYPES.TEXT;
}

/**
 * Adds a class to an element.
 */
export function addClass(elem: HTMLElement, className: string): void {
  if (elem.classList)
    return elem.classList.add(className);

  if (hasClass(elem, className))
    return;

  elem.className += " " + className;
}

/**
 * Checks, whether an element has a class.
 */
export function hasClass(elem: HTMLElement, className: string): boolean {
  if (elem.classList)
    return elem.classList.contains(className);

  var classes = elem.className.split(/\s+/);
  return classes.indexOf(className) > -1;
}

/**
 * Removes a class from an element.
 */
export function removeClass(elem: HTMLElement, className: string): void {
  if (elem.classList)
    return elem.classList.remove(className);

  var oldClasses = elem.className.split(/\s+/);
  var newClasses = [];
  for (var i = 0; i < oldClasses.length; i++) {
    var old = oldClasses[i];
    if (old !== className)
      newClasses.push(old);
  }

  if (oldClasses.length > newClasses.length)
    elem.className = newClasses.join(' ');
}
