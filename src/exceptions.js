var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Exception = (function () {
    function Exception(message) {
        this.message = message;
        this.name = "Exception";
    }
    Exception.prototype.toString = function () {
        return this.name + ": " + this.message;
    };
    return Exception;
})();
exports.Exception = Exception;

var NoSuchElementException = (function (_super) {
    __extends(NoSuchElementException, _super);
    function NoSuchElementException(message) {
        _super.call(this, message);
        this.name = "NoSuchElementException";
    }
    return NoSuchElementException;
})(Exception);
exports.NoSuchElementException = NoSuchElementException;

var IllegalArgumentException = (function (_super) {
    __extends(IllegalArgumentException, _super);
    function IllegalArgumentException(message) {
        _super.call(this, message);
        this.name = "IllegalArgumentException";
    }
    return IllegalArgumentException;
})(Exception);
exports.IllegalArgumentException = IllegalArgumentException;
