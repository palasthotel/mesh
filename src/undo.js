var UndoStack = (function () {
    function UndoStack(size, stack) {
        if (typeof size === "undefined") { size = 100; }
        if (typeof stack === "undefined") { stack = []; }
        this.size = size;
        this.cursor = stack.length - 1;
        this.stack = stack;
    }
    UndoStack.prototype.pushState = function (state) {
        this.stack.push(state);
    };
    return UndoStack;
})();
exports.UndoStack = UndoStack;
