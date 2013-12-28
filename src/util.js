var exceptions = require('./exceptions');

function requires(condition, msg) {
    if (!condition)
        throw new exceptions.IllegalArgumentException(msg);
}
exports.requires = requires;

function domReady(callback) {
    if (/in/.test(document.readyState))
        setTimeout(exports.domReady, 9, callback);
    else
        callback();
}
exports.domReady = domReady;

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
