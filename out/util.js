var exceptions = require('./exceptions');

function requires(condition, msg) {
    if (!condition)
        throw new exceptions.IllegalArgumentException(msg);
}
exports.requires = requires;

function extend(some, other) {
    var result = {};

    for (var prop in some) {
        result[prop] = some[prop];
    }

    for (var prop in other) {
        result[prop] = other[prop];
    }

    return result;
}
exports.extend = extend;

function xmlEncode(xml) {
    return xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
exports.xmlEncode = xmlEncode;

function xmlDecode(encoded) {
    return encoded.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, '\'').replace(/&amp;/g, '&');
}
exports.xmlDecode = xmlDecode;

function forEach(xs, action) {
    [].forEach.call(xs, action);
}
exports.forEach = forEach;

/**
* Maps a function on every item in the given Array.
*/
function map(xs, mapper) {
    var result = new Array(xs.length);
    for (var i = 0; i < xs.length; i++) {
        result[i] = mapper(xs[i]);
    }
    return result;
}
exports.map = map;

/**
* Filters items from the Array using a given function.
*/
function filter(xs, matcher) {
    var result = new Array();
    var x = null;
    for (var i = 0; i < xs.length; i++) {
        x = xs[i];
        if (matcher(x))
            result.push(x);
    }
    return xs;
}
exports.filter = filter;
