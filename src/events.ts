import util = require('./util');

/**
 * Event.
 */
export class Event {
  constructor(public source: EventEmitter, public type: string) {
  }
}

/**
 * Event listener.
 */
export interface EventListener {
  update(event: Event): void;
}

/**
 * Event emitter.
 */
export class EventEmitter {
  private listeners: {} = {};

  /**
   * Emits an event.
   */
  public emit(type: string): void {
    var event = new Event(this, type);
    var listenersForType = this.listeners[type];

    // ignore if nobody is listening
    if (typeof listenersForType === 'undefined')
      return;

    console.log(listenersForType.length);

    // inform the listeners
    util.forEach(listenersForType, (listener: (e: Event) => void) => {
      if (listener)
        listener(event);
    });
  }

  /**
   * Adds a listener to the event emitter.
   */
  public addListener(type: string, listener: (Event) => void): void {
    if (typeof this.listeners[type] === 'undefined') {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);
  }

  /**
   * Adds an event listener to the event emitter.
   */
  public addEventListener(type: string, listener: EventListener): void {
    this.addListener(type, listener.update);
  }

  /**
   * Removes a listener from the event emitter.
   */
  public removeListener(type: string, listener: (Event) => void): void {
    var ls = this.listeners[type];
    var len = ls.ls.length;

    // iterate over the list of listeners and replace the 
    for (var i = 0; i < len; i++) {
      if (ls.ls[i] === listener) {
        delete ls.ls[i];
      }
    }
  }

  /**
   * Removes an event listener from the event emitter.
   */
  public removeEventListener(type: string, listener: EventListener): void {
    this.removeListener(type, listener.update);
  }

  /**
   * Removes all listeners from the event emitter.
   */
  public removeAllListeners(type: string = null): void {
    if (type === null)
      this.listeners = {};
    else
      delete this.listeners[type];
  }
}

export interface Cancellable {
  cancel(): void;
}
