/**
 * Commonly used exception classes.
 * 
 * @module exceptions
 * 
 * @since 0.0.1
 * @author Paul Vorbach
 */

var oo = require('./oo.js');

var exceptions = exports;

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
exceptions.Exception = function Exception(message) {
  Error.call(this, message);
};

exceptions.Exception.prototype.name = 'Exception';

exceptions.Exception.prototype.toString = function() {
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
exceptions.NoSuchElementException = function NoSuchElementException(message) {
  Exception.call(this, message);
};

exceptions.NoSuchElementException.prototype.name = 'NoSuchElementException';

oo.extend(exceptions.NoSuchElementException, exceptions.Exception);

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
exceptions.IllegalArgumentException = function IllegalArgumentException(message) {
  Exception.call(this, message);
};

exceptions.IllegalArgumentException.prototype.name = 'IllegalArgumentException';

oo.extend(exceptions.IllegalArgumentException, exceptions.Exception);

/**
 * Not implemented.
 * 
 * Overriding this method is required.
 * 
 * @class NotImplementedException
 * @constructor
 * 
 * @param {String} message - error message
 * 
 * @extends Exception
 * 
 * @since 0.0.1
 */
exceptions.NotImplementedException = function NotImplementedException(message) {
  Exception.call(this, message);
}

exceptions.NotImplementedException.prototype.name = 'NotImplementedException';

oo.extend(exceptions.NotImplementedException, exceptions.Exception);
