var consts = require('./consts');

var util = require('./util');

/**
* DOM ready.
*/
function ready(callback) {
    if (/in/.test(document.readyState))
        setTimeout(exports.ready, 9, callback);
    else
        callback();
}
exports.ready = ready;

/**
* Creates an HTMLElement that already has a class.
*/
function createElement(tagName, className) {
    var element = document.createElement(tagName);
    exports.addClass(element, className);
    return element;
}
exports.createElement = createElement;

/**
* Checks, whether a node is an element.
*/
function isElement(node) {
    return node.nodeType === consts.NODE_TYPES.ELEMENT;
}
exports.isElement = isElement;

/**
* Checks, whether a node is a text node.
*/
function isTextNode(node) {
    return node.nodeType === consts.NODE_TYPES.TEXT;
}
exports.isTextNode = isTextNode;

function hasType(elem, type) {
    return elem.nodeName === type;
}
exports.hasType = hasType;

/**
* Checks, whether a node is the child of another node.
*/
function isChildOf(node, ancestor) {
    if (node.parentNode === null) {
        return false;
    } else if (node.parentNode.isSameNode(ancestor)) {
        return true;
    } else {
        return exports.isChildOf(node.parentNode, ancestor);
    }
}
exports.isChildOf = isChildOf;

/**
* Adds a class to an element.
*/
function addClass(elem, className) {
    if (elem.classList)
        return elem.classList.add(className);

    if (exports.hasClass(elem, className))
        return;

    elem.className += " " + className;
}
exports.addClass = addClass;

/**
* Checks, whether an element has a class.
*/
function hasClass(elem, className) {
    if (elem.classList)
        return elem.classList.contains(className);

    var classes = elem.className.split(/\s+/);
    return classes.indexOf(className) > -1;
}
exports.hasClass = hasClass;

/**
* Removes a class from an element.
*/
function removeClass(elem, className) {
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
exports.removeClass = removeClass;

/**
* Returns the first class of an element.
*/
function getFirstClass(elem) {
    if (elem.classList)
        return elem.classList[0];

    return elem.className.split(' ')[0];
}
exports.getFirstClass = getFirstClass;

/**
* Adds an event listener to an HTML element for several event types.
*/
function addEventListener(elem, eventName, callback) {
    if (elem.addEventListener)
        elem.addEventListener(eventName, callback, false);
    else
        elem.attachEvent('on' + eventName, callback);

    return {
        cancel: function () {
            if (elem.removeEventListener)
                elem.removeEventListener(eventName, callback);
            else
                elem.detachEvent('on' + eventName, callback);
        }
    };
}
exports.addEventListener = addEventListener;

function replaceNode(a, b) {
    a.parentNode.replaceChild(b, a);
}
exports.replaceNode = replaceNode;

function nodeToXML(node) {
    var result;

    if (node instanceof HTMLElement) {
        var elem = node;
        var tagName = elem.tagName.toLowerCase();
        result = '<' + tagName;

        // add attributes
        util.forEach(node.attributes, function (attr) {
            result += ' ' + attr.name + '="' + attr.value;
        });

        if (node.childNodes.length > 0) {
            result += '>';

            // add childNodes
            util.forEach(elem.childNodes, function (node) {
                result += exports.nodeToXML(node);
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
exports.nodeToXML = nodeToXML;
