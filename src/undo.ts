/**
 * Generic stack that can hold an undo history.
 */
export class UndoStack<T> {
  private cursor: number;
  private stack: Array<T>;

  constructor(public size: number = 100, stack: Array<T> = []) {
    this.cursor = stack.length - 1;
    this.stack = stack;
  }

  pushState(state: T) {
    this.stack.push(state);
  }
}
