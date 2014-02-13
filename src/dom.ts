import consts = require('./consts');
import events = require('./events');
import util = require('./util');

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
 * Creates an HTMLElement that already has a class.
 */
export function createElement(tagName: string, className: string): HTMLElement {
  var element = document.createElement(tagName);
  addClass(element, className);
  return element;
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

export function hasType(elem: HTMLElement, type: string): boolean {
  return elem.nodeName === type;
}

/**
 * Checks, whether a node is the child of another node.
 */
export function isChildOf(node: Node, ancestor: Node): boolean {
  if (node.parentNode === null) {
    return false;
  } else if (node.parentNode.isSameNode(ancestor)) {
    return true;
  } else {
    return isChildOf(node.parentNode, ancestor);
  }
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

/**
 * Returns the first class of an element.
 */
export function getFirstClass(elem: HTMLElement): string {
  if (elem.classList)
    return elem.classList[0];

  return elem.className.split(' ')[0];
}

/**
 * Adds an event listener to an HTML element for several event types.
 */
export function addEventListener(elem: HTMLElement, eventName: string,
  callback: (Event) => void): events.Cancellable {

  if (elem.addEventListener)
    elem.addEventListener(eventName, callback, false);
  else // IE <= 8
    elem.attachEvent('on' + eventName, callback);

  return {
    cancel: () => {
      if (elem.removeEventListener)
        elem.removeEventListener(eventName, callback);
      else // IE <= 8
        elem.detachEvent('on' + eventName, callback);
    }
  };
}

export function replaceNode(a: Node, b: Node): void {
  a.parentNode.replaceChild(b, a);
}

export function nodeToXML(node: Node): string {
  var result: string;

  if (node instanceof HTMLElement) {
    var elem = <HTMLElement> node;
    var tagName = elem.tagName.toLowerCase();
    result = '<' + tagName;

    // add attributes
    util.forEach(node.attributes, (attr: Attr) => {
      result += ' ' + attr.name + '="' + attr.value;
    });

    if (node.childNodes.length > 0) {
      result += '>';

      // add childNodes
      util.forEach(elem.childNodes, (node: Node) => {
        result += nodeToXML(node);
      });

      result += '</' + tagName + '>';
    } else {
      result += ' />';
    }
  } else {
    result = node.textContent;
  }

  return result;
}
