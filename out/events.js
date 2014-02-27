var util = require('./util');

/**
* Event.
*/
var Event = (function () {
    function Event(source, type) {
        this.source = source;
        this.type = type;
    }
    return Event;
})();
exports.Event = Event;


/**
* Event emitter.
*/
var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = {};
    }
    /**
    * Emits an event.
    */
    EventEmitter.prototype.emit = function (type) {
        var event = new Event(this, type);
        var listenersForType = this.listeners[type];

        // ignore if nobody is listening
        if (typeof listenersForType === 'undefined')
            return;

        console.log(listenersForType.length);

        // inform the listeners
        util.forEach(listenersForType, function (listener) {
            if (listener)
                listener(event);
        });
    };

    /**
    * Adds a listener to the event emitter.
    */
    EventEmitter.prototype.addListener = function (type, listener) {
        if (typeof this.listeners[type] === 'undefined') {
            this.listeners[type] = [];
        }

        this.listeners[type].push(listener);
    };

    /**
    * Adds an event listener to the event emitter.
    */
    EventEmitter.prototype.addEventListener = function (type, listener) {
        this.addListener(type, listener.update);
    };

    /**
    * Removes a listener from the event emitter.
    */
    EventEmitter.prototype.removeListener = function (type, listener) {
        var ls = this.listeners[type];
        var len = ls.ls.length;

        for (var i = 0; i < len; i++) {
            if (ls.ls[i] === listener) {
                delete ls.ls[i];
            }
        }
    };

    /**
    * Removes an event listener from the event emitter.
    */
    EventEmitter.prototype.removeEventListener = function (type, listener) {
        this.removeListener(type, listener.update);
    };

    /**
    * Removes all listeners from the event emitter.
    */
    EventEmitter.prototype.removeAllListeners = function (type) {
        if (typeof type === "undefined") { type = null; }
        if (type === null)
            this.listeners = {};
        else
            delete this.listeners[type];
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
