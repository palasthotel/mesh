/**
 * Utility functions used to interact with the DOM.
 * 
 * @module dom
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

var events = require('events');
var util = require('./util.js');

/**
 * Called when the DOM is ready.
 * 
 * @callback OnReadyCallback
 */

/**
 * Calls `cb` (without arguments) when the DOM is ready.
 * 
 * @param {OnReadyCallback} cb - callback
 * 
 * @since 0.0.1
 */
exports.onReady = function(cb) {
  if (/in/.test(document.readyState)) {
    setTimeout(ready, 9, cb);
  } else {
    cb();
  }
};

/**
 * Creates an `HTMLElement` with an optional class.
 * 
 * @param {String} tagName - tag name of the element
 * @param {String} [className] - class that the element should have
 * 
 * @returns {HTMLElement} created element
 * 
 * @since 0.0.1
 */
exports.createElement = function(tagName, className) {
  var elem = document.createElement(tagName);

  if (className) {
    addClass(elem, className);
  }

  return elem;
};

/**
 * Checks, whether the given `Node` is an `Element`.
 * 
 * @param {Node} node
 * 
 * @returns {Boolean}
 * 
 * @since 0.0.1
 */
exports.isElement = function(node) {
  return node.nodeType === 1;
};

/**
 * Checks, whether a given `Node` is a text node.
 * 
 * @param {Node} node
 * 
 * @returns {Boolean}
 * 
 * @since 0.0.1
 */
exports.isTextNode = function(node) {
  return node.nodeType === 3;
}

/**
 * Checks, whether a given `HTMLElement` has got the given "type".
 * 
 * @example For an `<a>` element, the call `hasType(elem, 'a')` will return
 *          `true`.
 * 
 * @param {HTMLElement} elem
 * @param {String} type
 * 
 * @returns {Boolean}
 * 
 * @since 0.0.1
 */
exports.hasType = function(elem, type) {
  return elem.nodeName === type;
};

/**
 * Adds a class to an element.
 * 
 * @param {HTMLElement} elem
 * @param {String} className - class name
 * 
 * @since 0.0.1
 */
exports.addClass = function(elem, className) {
  if (elem.classList)
    return elem.classList.add(className);

  if (hasClass(elem, className))
    return;

  elem.className += ' ' + className;
};

/**
 * Checks, whether an element has a given class.
 * 
 * @param {HTMLElement} elem
 * @param {String} className - class name
 * 
 * @returns {Boolean}
 * 
 * @since 0.0.1
 */
exports.hasClass = function(elem, className) {
  if (elem.classList)
    return elem.classList.contains(className);

  var classes = elem.className.split(/\s+/);
  return classes.indexOf(className) > -1;
};

/**
 * Removes a class from an element.
 * 
 * @param {HTMLElement} elem
 * @param {String} className - class name
 * 
 * @since 0.0.1
 */
exports.removeClass = function(elem, className) {
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
};

/**
 * Returns the first class of an element.
 * 
 * @param {HTMLElement} elem
 * 
 * @returns {String}
 * 
 * @since 0.0.1
 */
exports.getFirstClass = function(elem) {
  if (elem.classList)
    return elem.classList[0];

  return elem.className.split(' ')[0];
};

/**
 * Replaces `a` with `b`.
 * 
 * @param {Node} a
 * @param {Node} b
 * 
 * @since 0.0.1
 */
exports.replaceNode = function(a, b) {
  a.parentNode.replaceChild(b, a);
};

/**
 * Turns `node` into an XML string.
 * 
 * @param {Node} node
 * 
 * @returns {String} - string representation of the given node
 * 
 * @since 0.0.1
 */
exports.nodeToXML = function(node) {
  var result;

  if (node instanceof HTMLElement) {
    var tagName = node.tagName.toLowerCase();
    result = '<' + tagName;

    // add attributes
    util.forEach(node.attributes, function(attr) {
      result += ' ' + attr.name + '="' + attr.value;
    });

    if (node.childNodes.length > 0) {
      result += '>';

      // add childNodes
      util.forEach(elem.childNodes, function(node) {
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
