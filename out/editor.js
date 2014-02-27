var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require('./events');
var undo = require('./undo');
var exceptions = require('./exceptions');
var util = require('./util');

var dom = require('./dom');
var model = require('./model');
var dataStore = require('./dataStore');

/**
* Modular HTML5 WYSIWYG Editor (Controller).
*/
var Editor = (function (_super) {
    __extends(Editor, _super);
    function Editor(content, toolbar, plugins, conf) {
        var _this = this;
        _super.call(this);
        this.toolbar = toolbar;
        this.conf = conf;
        // IMPORTANT this attribute can be null!
        this.doc = null;

        util.requires(content.nodeName === 'TEXTAREA', 'not a textarea');

        this.conf = conf;
        this.undo = new undo.UndoStack(conf.undoSize);

        // set the view according to configuration
        if (conf.defaultView === 'textarea') {
            // use the textarea as-is
            this.content = content;

            // hide toolbar
            this.toolbar.style.display = 'none';
        } else if (conf.defaultView === 'contenteditable') {
            // use the id of the textarea as the new id of the container
            var id = content.id;
            this.content = document.createElement('div');
            this.content.id = id;

            // decode the existing content of the textarea
            this.setContent(util.xmlDecode(content.textContent));

            // replace the container node
            dom.replaceNode(content, this.content);

            // make content editable
            this.content.contentEditable = 'true';
        } else {
            throw new exceptions.InvalidConfigurationException('no such view: "' + conf.defaultView + '"');
        }

        // save a ref to this editor
        dataStore.get(this.content).editor = this;

        var delayedUndoID;

        // on every change of the content, push a new state to the undo stack
        this.doc.addListener('change', function () {
            delayedUndoID = setTimeout(function () {
                var content = _this.getContent();
                _this.undo.pushState(content);
            }, conf.undoDelay);
        });

        // install plugins
        util.forEach(plugins, function (p) {
            p.installPlugin(_this);
        });

        // emit change event after a short delay
        setTimeout(function () {
            _this.doc.emit('change');
        }, 0);
    }
    Editor.prototype.setContent = function (content) {
        if (dom.hasType(this.content, 'TEXTAREA')) {
            // straight forward
            this.content.textContent = content;
        } else {
            this.setDocument(new model.Document(this.content, content, this.conf));
        }
    };

    Editor.prototype.setDocument = function (doc) {
        this.doc = doc;
    };

    Editor.prototype.getDocument = function () {
        return this.doc;
    };

    Editor.prototype.getContent = function () {
        if (dom.hasType(this.content, 'TEXTAREA')) {
            return this.content.textContent;
        } else {
            return this.content.innerHTML;
        }
    };
    return Editor;
})(events.EventEmitter);
exports.Editor = Editor;
