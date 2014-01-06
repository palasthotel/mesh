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
 * Maximum number of "garbage" listeners.
 */
var maxGC = 20;

/**
 * Event emitter.
 */
export class EventEmitter {
  private listeners: {} = {};
  private gc: {} = {};

  /**
   * Emits an event.
   */
  public emit(type: string): void {
    var event = new Event(this, type);
    var ls = this.listeners[type];
    var len = ls.length;

    for (var i = 0; i < len; i++) {
      if (ls[i] === null)
        continue;

      ls[i](event);
    }
  }

  /**
   * Adds a listener to the event emitter.
   */
  public addListener(type: string, listener: (Event) => void): void {
    if (!this.listeners[type]) {
      var ls = { ls: [], gc: 0 }; // listeners and garbage count
      this.listeners[type] = ls;
    }

    this.listeners[type].ls.push(listener);
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
        ls.ls[i] = null;
        ls.gc++;
      }
    }

    if (ls.gc > maxGC)
      this.runGarbageCollector(type);
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
  public removeAllListeners(type: string = null) {

  }

  /**
   * Garbage collect listeners.
   */
  private runGarbageCollector(type: string): void {
    var ls = this.listeners[type];
    var len = ls.ls.length;

    // new garbage collected listeners array
    var newLS = { ls: new Array(len - ls.gc), gc: 0 };

    // walk old listeners, add listener to newLS if not null
    for (var i = 0, j = 0; i < len; i++) {
      if (ls.ls[i] !== null)
        newLS.ls[j++] = ls.ls[i];
    }

    this.listeners[type] = newLS;
  }
}

export interface Cancellable {
  cancel(): void;
}
