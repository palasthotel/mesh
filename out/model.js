var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dom = require('./dom');

var events = require('./events');
var util = require('./util');
var dataStore = require('./dataStore');
var sortable = require('./sortable');

var Document = (function (_super) {
    __extends(Document, _super);
    function Document(elem, content, conf) {
        _super.call(this);
        this.elem = elem;

        // helper div, will be discarded later on
        var helper = document.createElement('div');
        helper.innerHTML = content;

        var docFragment = document.createDocumentFragment();

        while (helper.children.length > 0) {
            var child = helper.children[0];
            var blockElement = dom.createElement('div', 'block');
            var blockFragment = document.createDocumentFragment();
            var handle = dom.createElement('div', 'handle');
            var controls = dom.createElement('div', 'controls');

            blockFragment.appendChild(handle);
            blockFragment.appendChild(child);
            blockFragment.appendChild(controls);

            blockElement.appendChild(blockFragment);

            // create new block
            new Block(blockElement, this);

            docFragment.appendChild(blockElement);
        }

        this.elem.appendChild(docFragment);

        sortable.makeSortable(this, {});
    }
    Document.prototype.length = function () {
        return this.elem.children.length;
    };

    Document.prototype.getBlock = function (i) {
        return dataStore.get(this.elem.children[i]).block;
    };

    Document.prototype.insertBlockAt = function (i, newBlock) {
        this.elem.insertBefore(newBlock.elem, this.elem.children[i]);

        this.emit('change');
        this.emit('addblock');
    };

    Document.prototype.removeBlock = function (i) {
        this.elem.removeChild(this.elem.children[i]);

        this.emit('change');
        this.emit('removeblock');
    };

    /**
    * Replaces the block at index i by another one.
    */
    Document.prototype.replaceBlock = function (i, newBlock) {
        dom.replaceNode(newBlock.elem, this.elem.children[i]);

        this.emit('change');
    };

    Document.prototype.toHTML = function () {
        var result = '';
        var length = this.length();
        for (var i = 0; i < length; i++) {
            result += this.getBlock(i).toHTML() + '\n';
        }
        return result;
    };
    return Document;
})(events.EventEmitter);
exports.Document = Document;

var Block = (function (_super) {
    __extends(Block, _super);
    function Block(elem, doc) {
        var _this = this;
        _super.call(this);
        this.elem = elem;
        this.doc = doc;

        var dataRef = dataStore.get(elem);
        dataRef.block = this;

        this.handle = elem.children[0];
        this.content = elem.children[1];
        this.controls = elem.children[2];

        this.handle.contentEditable = 'false';
        this.controls.contentEditable = 'false';

        // listen on keydown events
        dom.addEventListener(elem, 'keydown', function (ev) {
            _this.emit('change');
        });
    }
    Block.prototype.toHTML = function () {
        var result = '';
        var content = this.content;

        var tagName;
        if (dom.hasType(content, 'DIV'))
            tagName = dom.getFirstClass(content);
        else
            tagName = this.content.tagName.toLowerCase();

        result += '<' + tagName + '>';

        util.forEach(content.childNodes, function (node) {
            result += dom.nodeToXML(node);
        });

        result += '</' + tagName + '>';

        return result;
    };
    return Block;
})(events.EventEmitter);
exports.Block = Block;
