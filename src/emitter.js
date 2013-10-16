(function() {
  'use strict';

  if (typeof module === 'object')
    module.exports = Emitter;
  else
    window.Emitter = Emitter;

  /**
   * Initialize a new `Emitter`.
   * 
   * @api public
   */
  function Emitter(obj) {
    if (obj)
      return mixin(obj);
  }

  /**
   * Mixin the emitter properties.
   * 
   * @param {Object}
   *                obj
   * @return {Object}
   * @api private
   */
  function mixin(obj) {
    for ( var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }

  /**
   * Listen on the given `event` with `fn`.
   * 
   * @param {String}
   *                event
   * @param {Function}
   *                fn
   * @return {Emitter}
   */
  Emitter.prototype.addEventListener = function(event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks[event] = this._callbacks[event] || []).push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single time then
   * automatically removed.
   * 
   * @param {String}
   *                event
   * @param {Function}
   *                fn
   * @return {Emitter}
   */
  Emitter.prototype.addOneTimeEventListener = function(event, fn) {
    var self = this;
    this._callbacks = this._callbacks || {};

    function on() {
      self.removeEventListener(event, on);
      fn.apply(this, arguments);
    }

    fn._off = on;
    this.addEventListener(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all registered callbacks.
   * 
   * @param {String}
   *                event
   * @param {Function}
   *                fn
   * @return {Emitter}
   */
  Emitter.prototype.removeEventListener = function(event, fn) {
    this._callbacks = this._callbacks || {};

    // remove all
    if (arguments.length === 0) {
      this._callbacks = {};
      return this;
    }

    // remove specific event
    var callbacks = this._callbacks[event];
    if (!callbacks)
      return this;

    // remove remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks[event];
      return this;
    }

    // remove specific handler
    var i = indexOf(callbacks, fn._off || fn);
    if (~i)
      callbacks.splice(i, 1);
    return this;
  };

  // invoke without arguments to remove all listeners
  Emitter.prototype.removeAllEventListeners =
      Emitter.prototype.removeEventListener;

  /**
   * Emit `event` with the given args.
   * 
   * @param {String}
   *                event
   * @param {Mixed}
   *                ...
   * @return {Emitter}
   */
  Emitter.prototype.emitEvent = function(event) {
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1);
    var callbacks = this._callbacks[event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for ( var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };

  /**
   * Return array of callbacks for `event`.
   * 
   * @param {String}
   *                event
   * @return {Array}
   */
  Emitter.prototype.getEventListeners = function(event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks[event] || [];
  };

  /**
   * Check if this emitter has `event` handlers.
   * 
   * @param {String}
   *                event
   * @return {Boolean}
   */
  Emitter.prototype.hasEventListeners = function(event) {
    return !!this.getEventListeners(event).length;
  };

})();
