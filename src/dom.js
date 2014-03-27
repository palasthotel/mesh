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

var dom = module.exports;

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
dom.onReady = function(cb) {
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
 * @param {String} [className] - class that the element should have (may be
 *                space seperated list of classes)
 * 
 * @returns {HTMLElement} created element
 * 
 * @since 0.0.1
 */
dom.createElement = function(tagName, className) {
  var elem = document.createElement(tagName);

  if (className) {
    var classes = className.split(' ');
    for (var i = 0; i < classes.length; i++) {
      dom.addClass(elem, classes[i]);
    }
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
dom.isElement = function(node) {
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
dom.isTextNode = function(node) {
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
dom.hasType = function(elem, type) {
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
dom.addClass = function(elem, className) {
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
dom.hasClass = function(elem, className) {
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
dom.removeClass = function(elem, className) {
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
dom.getFirstClass = function(elem) {
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
dom.replaceNode = function(a, b) {
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
dom.nodeToXML = function(node) {
  var result;

  if (node instanceof HTMLElement) {
    var tagName = node.tagName.toLowerCase();
    result = '<' + tagName;

    // add attributes
    util.forEach(node.attributes, function(attr) {
      if (attr.name === 'style') {
        return;
      }

      result += ' ' + attr.name + '="' + attr.value + '"';
    });

    if (node.childNodes.length > 0) {
      result += '>';

      // add childNodes
      util.forEach(node.childNodes, function(node) {
        result += dom.nodeToXML(node);
      });

      result += '</' + tagName + '>';
    } else {
      result += ' />';
    }
  } else {
    result = node.textContent;
  }

  return result;
};

dom.containsNode = function(ancestor, child) {
  while (child.parentNode !== null) {
    if (child.parentNode === ancestor)
      return true;

    child = child.parentNode;
  }

  return false;
};

/**
 * Checks whether a node is inside an element that can be matched by the given
 * selector and returns that ancestor node.
 * 
 * @param {Node} node - dom node
 * @param {String} selector - jQuery/CSS selector
 * @param {Node} [top] - won't search for ancestors higher than this node
 * 
 * @return {Node}
 */
dom.matchParent = function(node, selector, top) {
  if (typeof top === 'undefined')
    top = null;

  if ($(node).is(selector)) {
    return node;
  }

  while (node.parentNode !== top) {
    if ($(node.parentNode).is(selector)) {
      return node.parentNode;
    }

    node = node.parentNode;
  }

  return null;
};

dom.unwrapChildren = function(elem) {
  while (elem.firstChild) {
    elem.parentNode.insertBefore(elem.firstChild, elem);
  }

  elem.parentNode.removeChild(elem);
};

/**
 * Selects all elements between `start` and `end`.
 * 
 * If `end` is not found, this function will return all elements until there is
 * no next element.
 * 
 * @param {HTMLElement} start
 * @param {HTMLElement} end
 * 
 * @returns {Array<HTMLElement>}
 */
dom.allBetween = function(start, end) {
  if (start === null || end === null) {
    return [];
  }

  var result = [ start ];

  if (start.isSameNode(end)) {
    return result;
  }

  var next = start.nextSibling;
  while (next !== null) {
    result.push(next);

    if (end.isSameNode(next)) {
      break;
    }

    next = next.nextSibling;
  }

  return result;
};

dom.createDivIfNotFound = function(id) {
  var elem = document.getElementById(id);
  if (elem === null) {
    elem = document.createElement('div');
    elem.id = id;
    document.body.appendChild(elem);
  }
  return elem;
};

dom.removeAllChildren = function(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

dom.removeAllAttributes = function(elem) {
  while (elem.attributes.length > 0) {
    elem.removeAttributeNode(elem.attributes[0]);
  }
};

dom.moveChildNodes = function(from, to) {
  while (from.firstChild) {
    to.appendChild(from.firstChild);
  }
};

var combinableElements = 'B,I,U,STRONG,EM,SUP,SUB'.split(',');
var inheritedElements = 'B,I,U,STRONG,EM'.split(',');

function isCombinable(node) {
  return combinableElements.indexOf(node.nodeName) > -1;
}

function isInherited(node) {
  return combinableElements.indexOf(node.nodeName) > -1;
}

dom.cleanupElement = function(elem) {
  // copy the existing element
  var prevPrevNode = null;
  var prevNode = null;

  util.forEach(elem.childNodes, function(childNode) {
    // if the parent node of this node is of the same type, remove child node
    // example: '<b>Hello <b>you</b>!</b>' --> '<b>Hello you!</b>'
    if (elem.nodeName === childNode.nodeName && isInherited(childNode)) {
      while (childNode.firstChild) {
        elem.insertBefore(childNode.firstChild, childNode);
      }

      elem.removeChild(childNode);
    }

    if (prevNode !== null) {
      // Combine elements of same type
      if (childNode.nodeType === 1 && prevNode.nodeType === 1
          && prevNode.nodeName === childNode.nodeName
          && isCombinable(childNode)) {

        // do a cleanup
        dom.cleanupElement(childNode);

        // combine both elements
        prevNode.innerHTML = prevNode.innerHTML + childNode.innerHTML;
        return elem.removeChild(childNode);
      }
    }

    if (prevNode !== null && prevPrevNode !== null) {
      if (childNode.nodeType === 1 && prevNode.nodeType === 3
          && prevPrevNode.nodeType === 1
          && childNode.nodeName === prevPrevNode.nodeName
          && /^\s*$/.test(prevNode.textContent) && isCombinable(childNode)) {
        prevPrevNode.innerHTML = prevPrevNode.innerHTML + prevNode.textContent
            + childNode.innerHTML;

        elem.removeChild(prevNode);
        elem.removeChild(childNode);

        childNode = null;
        prevNode = null;
      }
    } else {
      dom.cleanupElement(childNode);
    }

    // backtracking
    prevPrevNode = prevNode;
    prevNode = childNode;
  });

  return elem;
};
