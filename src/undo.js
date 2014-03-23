/**
 * Tools for undoing things.
 * 
 * @module undo
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

exports.UndoStack = UndoStack;

/**
 * Used to keep track of states.
 * 
 * @constructor
 * 
 * @param {Number} [size=50] - number of elements the stack can store
 * @param {T[]} [stack=[]] - pre-filled stack as an Array. This can be used to
 *                regain a previously persisted `UndoStack`.
 */
function UndoStack(size, stack) {
  if (typeof size === "undefined" || size <= 0) {
    size = 50;
  }

  if (typeof stack === "undefined") {
    stack = new Array(size);
  }

  this._size = size;
  this._stack = stack;
  this._cursor = -1;
  this._top = -1;
}

/**
 * Add a new state.
 * 
 * @param {T} state
 */
UndoStack.prototype.addState = function(state) {
  this._cursor++;

  if (this._cursor == this._size) {
    // remove the first item
    this._stack = this._stack.slice(1);
    this._stack.push(state); // append new state
    this._cursor--; // decrement the cursor
  } else {
    this._stack[this._cursor] = state;
  }

  this._top = this._cursor;
};

UndoStack.prototype.hasPreviousState = function() {
  return this._cursor > 0;
};

/**
 * Pop a state.
 * 
 * @returns {T}
 */
UndoStack.prototype.getPreviousState = function() {
  return this._stack[--this._cursor];
};

UndoStack.prototype.hasNextState = function() {
  return this._cursor < this._top;
};

UndoStack.prototype.getNextState = function() {
  return this._stack[this._cursor++];
};
