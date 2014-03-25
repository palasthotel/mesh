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
 * @param {String} name - name of the exception type
 * @param {String} message - error message
 * 
 * @since 0.0.1
 */
exceptions.Exception = function Exception(name, message) {
  Error.call(this);
  this.name = name;
  this.message = message;
};

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
  exceptions.Exception.call(this, 'NoSuchElementException', message);
};

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
  exceptions.Exception.call(this, 'IllegalArgumentException', message);
};

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
exceptions.ImplementationMissingException = function ImplementationMissingException(
    message) {
  exceptions.Exception.call(this, 'NotImplementedException', message);
}

oo.extend(exceptions.ImplementationMissingException, exceptions.Exception);
