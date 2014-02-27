/**
* Generic stack that can hold an undo history.
*/
var UndoStack = (function () {
    function UndoStack(size, stack) {
        if (typeof size === "undefined") { size = 50; }
        if (typeof stack === "undefined") { stack = []; }
        this.size = size;
        this.stack = stack;
        this.cursor = stack.length - 1;
    }
    UndoStack.prototype.pushState = function (state) {
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
    };

    UndoStack.prototype.popState = function () {
        this.cursor--;

        // can't pop state below zero, will return stack[0] instead
        if (this.cursor < 0) {
            this.cursor = 0;
        }

        return this.stack[this.cursor];
    };
    return UndoStack;
})();
exports.UndoStack = UndoStack;
