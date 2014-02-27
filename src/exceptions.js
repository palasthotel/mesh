/**
 * Commonly used exception classes.
 * 
 * @module exceptions
 * 
 * @since 0.0.1
 * @author Paul Vorbach
 */

var oo = require('./oo.js');

/**
 * Standard exception.
 * 
 * @class Exception
 * @constructor
 * 
 * @param {String} message - error message
 * 
 * @since 0.0.1
 */
exports.Exception = function Exception(message) {
  Error.call(this, message);
};

exports.Exception.prototype.name = 'Exception';

exports.Exception.prototype.toString = function() {
  return this.name + ': ' + this.message;
};

/**
 * No such element.
 * 
 * Usually caused by trying to access an out-of-bounds index or a
 * property/method that doesn't exist.
 * 
 * @class NoSuchElementException
 * @constructor
 * 
 * @param {String} message - error message
 * 
 * @extends Exception
 * 
 * @since 0.0.1
 */
exports.NoSuchElementException = function NoSuchElementException(message) {
  Exception.call(this, message);
};

exports.NoSuchElementException.prototype.name = 'NoSuchElementException';

oo.extend(exports.NoSuchElementException, exports.Exception);

/**
 * Illegal argument.
 * 
 * Index out of bounds.
 * 
 * @class IllegalArgumentException
 * @constructor
 * 
 * @param {String} message - error message
 * 
 * @extends Exception
 * 
 * @since 0.0.1
 */
exports.IllegalArgumentException = function IllegalArgumentException(message) {
  Exception.call(this, message);
};

exports.IllegalArgumentException.prototype.name = 'IllegalArgumentException';

oo.extend(exports.IllegalArgumentException, exports.Exception);
