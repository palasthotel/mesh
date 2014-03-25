var mesh = require('../src/index.js');

var dom = mesh.dom;
var oo = mesh.oo;
var plugin = mesh.plugin;

var controls = module.exports = [];

function BoldButton(editor) {
  plugin.Button.call(this, editor, '<i class="fa fa-bold" />',
      'make selection bold');
}

oo.extend(BoldButton, plugin.Button);

function buttonActionFor(nodeName) {
  return function(selectionModel, range) {
    var found = false;
    var affected = null;
    if ((affected = dom.matchParent(range.startContainer, nodeName)) !== null) {
      found = true;
      // remove <strong>
      dom.unwrapChildren(affected);
    }

    if ((affected = dom.matchParent(range.endContainer, nodeName)) !== null) {
      found = true;
      // remove <strong>
      dom.unwrapChildren(affected);
    }

    if (found) {
      this.getEditor().getView().emit('edit');
      return;
    }

    var newNode = document.createElement(nodeName);
    // wrap selected range with newly created element
    range.surroundContents(newNode);

    // TODO set range to surround that element
    // var newRange = rangy.createRange();
    // range.selectNodeContents(newNode);
    // rangy.getSelection().setSingleRange(newRange);

    // contents changed
    this.getEditor().getView().emit('edit');
  };
}

function buttonSelectionChangeFor(nodeName) {
  return function() {
    var sel = rangy.getSelection();
    if (sel.rangeCount === 0) {
      return this.setActivated(false);
    }

    var range = sel.getRangeAt(0);

    if (dom.matchParent(range.startContainer, nodeName) === null
        || dom.matchParent(range.endContainer, nodeName) === null) {
      this.setActivated(false);
    } else {
      this.setActivated(true);
    }
  };
}

var boldAction = buttonActionFor('strong');
BoldButton.prototype.action = function(selectionModel, range) {
  boldAction.call(this, selectionModel, range);
};

var boldSelectionChange = buttonSelectionChangeFor('strong');
BoldButton.prototype.selectionChange = function() {
  boldSelectionChange.call(this);
};

function ItalicButton(editor) {
  plugin.Button.call(this, editor, '<i class="fa fa-italic" />',
      'make selection italic');
}

oo.extend(ItalicButton, plugin.Button);

var italicAction = buttonActionFor('em');
ItalicButton.prototype.action = function(selectionModel, range) {
  italicAction.call(this, selectionModel, range);
};

var italicSelectionChange = buttonSelectionChangeFor('em');
ItalicButton.prototype.selectionChange = function() {
  italicSelectionChange.call(this);
};

// finally set the order of the buttons
controls.push(BoldButton);
controls.push(ItalicButton);
// TODO controls.push(plugin.Divider);
