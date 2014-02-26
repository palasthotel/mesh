/**
 * Helpers for object-oriented programming.
 * 
 * @module oo
 */

/**
 * Object.create();
 * 
 * @method
 * 
 * @param {Object} proto - The object which should be the prototype of the
 *                newly-created object.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 * 
 * @since 0.0.1
 */
exports.createObject = Object.create || function(o) {
  var T = function() {};
  T.prototype = o;
  return new T();
};
