/**
 * Helpers for object-oriented programming.
 * 
 * @module oo
 */

/**
 * Same as `Object.create(proto)`. Used since older browsers don't support
 * `Object.create()` _out of the box_.
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
exports.createObject = Object.create || function(proto) {
  var T = function() {};
  T.prototype = proto;
  return new T();
};

/**
 * `Sub` extends `Super`, i.e. `Sub` inherits all members from `Super`.
 * (Pseudoclass inheritance)
 * 
 * @param {*} Sub - child
 * @param {*} Super - parent
 * 
 * @since 0.0.1
 * @see http://molily.de/weblog/javascript-pseudoklassen
 * 
 * @example
 * 
 * var oo = require('./oo.js');
 * 
 * function SuperClass(a) {
 *   this._a = a;
 * }
 * 
 * // You need to call the constructor of SuperClass,
 * // otherwise attributes may not get initialized
 * // properly.
 * function SubClass(a, b) {
 *   SuperClass.call(this, a);
 *   this._b = b;
 * }
 * 
 * oo.extend(SubClass, SuperClass);
 */
exports.extend = function(SubClass, SuperClass) {
  SubClass.prototype = exports.createObject(SuperClass.prototype);
  SubClass.prototype.constructor = SubClass;
};
