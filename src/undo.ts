/**
 * Generic stack that can hold an undo history.
 */
export class UndoStack<T> {
  // points on the element that would be popped next
  private cursor: number;

  constructor(public size: number = 50, private stack: Array<T> = []) {
    this.cursor = stack.length - 1;
  }

  pushState(state: T) {
    // lose states that have been popped before
    if (this.cursor < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.cursor);
    }

    if (this.cursor === this.size - 1) {
      // if the stack has reached the maximum size, remove the first item
      this.stack = this.stack.slice(1);
    } else {
      // otherwise, just increment the cursor
      this.cursor++;
    }

    // push the new state
    this.stack.push(state);
  }

  popState(): T {
    this.cursor--;

    // can't pop state below zero, will return stack[0] instead
    if (this.cursor < 0) {
      this.cursor = 0;
    }

    return this.stack[this.cursor];
  }
}
