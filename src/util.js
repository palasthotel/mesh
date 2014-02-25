/**
 * General purpose utility functions.
 * 
 * @module util
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

var exceptions = require('./exceptions.js');

/**
 * Requires `condition` to be `true`. Otherwise an `IllegalArgumentException`
 * will be thrown.
 * 
 * @param {Boolean} condition - condition to be met
 * @param {String} msg - message in error case
 * 
 * @throws {IllegalArgumentException}
 * 
 * @since 0.0.1
 */
exports.requires = function(condition, msg) {
  if (!condition)
    throw new exceptions.IllegalArgumentException(msg);
};

/**
 * Extends `a` with `b` by adding all properties of `b` to a copy of `a`. `a`
 * and `b` do not change but a new `Object` is returned.
 * 
 * @param {Object} a - extended object
 * @param {Object} b - extending object
 * 
 * @returns {Object}
 * 
 * @since 0.0.1
 */
exports.extend = function(a, b) {
  var result = {};

  for ( var prop in a) {
    result[prop] = a[prop];
  }

  for ( var prop in b) {
    result[prop] = b[prop];
  }

  return result;
};

/**
 * Encodes `xml` with XML entities for `<`, `>`, `&`, `"` and `'`.
 * 
 * @param {String} xml - plain XML string
 * 
 * @returns {String} encoded XML string
 * 
 * @since 0.0.1
 */
exports.xmlEncode =
    function(xml) {
      return xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
          '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

/**
 * Decodes a previously encoded XML string.
 * 
 * @param {String} encodedXML - encoded XML string
 * 
 * @returns {String} plain XML string
 * 
 * @since 0.0.1
 */
exports.xmlDecode =
    function(encodedXML) {
      return encoded.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(
          /&quot;/g, '"').replace(/&#039;/g, '\'').replace(/&amp;/g, '&');
    };

/**
 * Apply an action to `arg`.
 * 
 * @callback Action
 * 
 * @param {T} t
 */

/**
 * Apply `action` to each element in `xs`.
 * 
 * @param {T[]|*} ts
 * @param {Action} action
 * 
 * @since 0.0.1
 */
exports.forEach = function(ts, action) {
  [].forEach.call(ts, action);
}

/**
 * Maps `T` to `S`.
 * 
 * @callback Mapper
 * 
 * @param {T} t
 * @returns {S}
 */

/**
 * Maps a function on every item in the given array.
 * 
 * @param {T[]} ts
 * @param {Mapper} mapper
 * 
 * @returns {S[]}
 * 
 * @since 0.0.1
 */
exports.map = function(ts, mapper) {
  var result = new Array(ts.length);
  for (var i = 0; i < ts.length; i++) {
    result[i] = mapper(ts[i]);
  }
  return result;
};

/**
 * Decides, if `t` is accepted or not.
 * 
 * @callback Filter
 * 
 * @param {T} t
 * @returns {Boolean}
 */

/**
 * Filters items from `ts` using a `filter`.
 * 
 * @param {T[]} ts
 * @param {Filter} filter
 * 
 * @returns {T[]}
 * 
 * @since 0.0.1
 */
exports.map = function(ts, filter) {
  var result = new Array();
  var t = null;
  for (var i = 0; i < ts.length; i++) {
    t = ts[i];
    if (filter(t)) {
      result.push(t);
    }
  }
  return result;
};
