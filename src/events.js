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


var maxGC = 10;

/**
* Event emitter.
*/
var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = {};
        this.gc = {};
    }
    EventEmitter.prototype.emit = function (type) {
        var event = new Event(this, type);
        var ls = this.listeners[type];
        var len = ls.length;

        for (var i = 0; i < len; i++) {
            if (ls[i] === null)
                continue;

            ls[i](event);
        }
    };

    EventEmitter.prototype.addListener = function (type, listener) {
        if (!this.listeners[type]) {
            var ls = { ls: [], gc: 0 };
            this.listeners[type] = ls;
        }

        this.listeners[type].ls.push(listener);
    };

    EventEmitter.prototype.addEventListener = function (type, listener) {
        this.addListener(type, listener.update);
    };

    EventEmitter.prototype.removeListener = function (type, listener) {
        var ls = this.listeners[type];
        var len = ls.ls.length;

        for (var i = 0; i < len; i++) {
            if (ls.ls[i] === listener) {
                ls.ls[i] = null;
                ls.gc++;
            }
        }

        if (ls.gc > maxGC)
            this.runGarbageCollector(type);
    };

    EventEmitter.prototype.removeEventListener = function (type, listener) {
        this.removeListener(type, listener.update);
    };

    EventEmitter.prototype.removeAllListeners = function (type) {
        if (typeof type === "undefined") { type = null; }
    };

    /**
    * Garbage collect listeners.
    */
    EventEmitter.prototype.runGarbageCollector = function (type) {
        var ls = this.listeners[type];
        var len = ls.ls.length;

        // new garbage collected listeners array
        var newLS = { ls: new Array(len - ls.gc), gc: 0 };

        for (var i = 0, j = 0; i < len; i++) {
            if (ls.ls[i] !== null)
                newLS.ls[j++] = ls.ls[i];
        }

        this.listeners[type] = newLS;
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
