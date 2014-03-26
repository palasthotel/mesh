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
  return function() {
    var editorView = this.getEditor().getView();
    var viewElem = editorView.getElement();
    var selectionModel = editorView.getSelectionModel();

    var selection = rangy.getSelection();
    if (selection.rangeCount === 0) {
      return;
    }

    var range = selection.getRangeAt(0);
    // determine if range is in editor
    // if not, do nothing
    if (!range.isValid() || !dom.containsNode(viewElem, range.startContainer)
        || !dom.containsNode(viewElem, range.endContainer)) {
      return;
    }

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

    if (range.collapsed) {
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
    var viewElem = this.getEditor().getView().getElement();

    if (!dom.containsNode(viewElem, range.startContainer)
        || !dom.containsNode(viewElem, range.endContainer)) {
      return this.setEnabled(false);
    } else {
      this.setEnabled(true);
    }

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

function AnchorButton(editor) {
  plugin.Button.call(this, editor, '<i class="fa fa-anchor" />',
      'create a link')
}

oo.extend(AnchorButton, plugin.Button);

AnchorButton.prototype.action = function() {
  var editorView = this.getEditor().getView();
  var viewElem = editorView.getElement();
  var selectionModel = editorView.getSelectionModel();

  var selection = rangy.getSelection();
  if (selection.rangeCount === 0) {
    return;
  }

  var range = selection.getRangeAt(0);
  // determine if range is in editor
  // if not, do nothing
  if (!range.isValid() || !dom.containsNode(viewElem, range.startContainer)
      || !dom.containsNode(viewElem, range.endContainer)) {
    return;
  }

  var url = '';
  var affected = null;
  if ((affected = dom.matchParent(range.startContainer, 'a')) !== null
      || (affected = dom.matchParent(range.endContainer, 'a')) !== null) {
    // get existing URL
    url = $(affected).attr('href');

    // prompt for new URL
    url = prompt('Change URL:', url);
    if (url === null) {
      return;
    }

    if (url === '') {
      // remove <strong>
      dom.unwrapChildren(affected);
    } else {
      $(affected).attr('href', url);
    }

    this.getEditor().getView().emit('edit');
    return;
  }

  if (range.collapsed) {
    return;
  }

  var newNode = document.createElement('a');

  // prompt for new URL
  url = prompt('Enter URL:', url);

  // if URL is empty, decard creating link
  if (url === null || url === '') {
    return;
  }

  $(newNode).attr('href', url);
  // wrap selected range with newly created element
  range.surroundContents(newNode);

  // contents changed
  this.getEditor().getView().emit('edit');
};

var anchorSelectionChange = buttonSelectionChangeFor('a');
AnchorButton.prototype.selectionChange = function() {
  anchorSelectionChange.call(this);
};

function UndoButton(editor) {
  plugin.Button.call(this, editor, '<i class="fa fa-undo" />',
      'undo last change');
}

oo.extend(UndoButton, plugin.Button);

UndoButton.prototype.contentChange = function() {
  if (this.getEditor().getUndoStack().hasPreviousState()) {
    this.setEnabled(true);
  } else {
    this.setEnabled(false);
  }
};

UndoButton.prototype.action = function() {
  this.getEditor().undo();
};

function RedoButton(editor) {
  plugin.Button.call(this, editor, '<i class="fa fa-repeat" />',
      'redo last change');
}

oo.extend(RedoButton, plugin.Button);

RedoButton.prototype.contentChange = function() {
  if (this.getEditor().getUndoStack().hasNextState()) {
    this.setEnabled(true);
  } else {
    this.setEnabled(false);
  }
};

RedoButton.prototype.action = function() {
  this.getEditor().redo();
};

var blockTypes = require('./block-types.js');
function ContentTypeSelect(editor) {
  this._blockTypes = blockTypes;

  var blockType = null;
  var options = [];
  for (var i = 0; i < blockTypes.length; i++) {
    blockType = blockTypes[i];
    options.unshift({
      value : blockType.getValue(),
      label : blockType.getLabel()
    });
  }

  plugin.Dropdown.call(this, editor, 'select style', options);
}

oo.extend(ContentTypeSelect, plugin.Dropdown);

ContentTypeSelect.prototype.selectionChange = function() {
  var editorView = this.getEditor().getView();
  var selectionModel = editorView.getSelectionModel();

  if (selectionModel.length === 0) {
    this.setEnabled(false);
    return;
  } else {
    this.setEnabled(true);
  }

  $(this.getElement()).val(selectionModel[0].getType().getValue());
};

// finally set the order of the buttons
controls.push(ContentTypeSelect);
controls.push(plugin.Divider);
controls.push(BoldButton);
controls.push(ItalicButton);
controls.push(plugin.Divider);
controls.push(AnchorButton);
controls.push(plugin.Divider);
controls.push(UndoButton);
controls.push(RedoButton);
