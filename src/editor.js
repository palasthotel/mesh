var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require('./events');
var undo = require('./undo');

var util = require('./util');
var consts = require('./consts');

/**
* Modular HTML5 WYSIWYG Editor.
*/
var Editor = (function (_super) {
    __extends(Editor, _super);
    function Editor(elem, conf) {
        _super.call(this);

        util.requires(elem.nodeName === consts.NODE_NAMES.TEXTAREA, 'not a textarea');

        this.container = elem;
        this.conf = conf;
        this.undo = new undo.UndoStack(conf.undoSize);
    }
    return Editor;
})(events.EventEmitter);
exports.Editor = Editor;
