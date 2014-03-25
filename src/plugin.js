var dom = require('./dom.js');
var exceptions = require('./exceptions.js');
var oo = require('./oo.js');

exports.ControlElement = ControlElement;

/**
 * 
 * @param {Editor} editor - reference to the containing editor
 */
function ControlElement(editor) {
  this._elem = null;
  this._editor = editor;

  editor.getToolbar().appendChild(this.getElement());
};

ControlElement.prototype.getEditor = function() {
  return this._editor;
};

ControlElement.prototype.getElement = function() {
  throw new exceptions.ImplementationMissingException(
      'Override ControlElement.prototype.getElement()');
};

/**
 * Override this method to change something when the selection changes.
 */
ControlElement.prototype.selectionChange = function() {
};

exports.Button = Button;

function Button(editor, content, hint) {
  this._content = content;
  this._hint = hint;

  ControlElement.call(this, editor);
}

oo.extend(Button, ControlElement);

Button.prototype.getElement = function() {
  if (this._elem === null) {
    var $button = $('<button class="mesh-button" title="' + this._hint + '">'
        + this._content + '</button>');
    var button = this;

    $button.click(function onClick(e) {
      e.preventDefault();

      var editor = button.getEditor();

      var viewElem = editor.getView().getElement();
      var selectionModel = editor.getView().getSelectionModel();

      var sel = rangy.getSelection();

      // don't apply a range, if no one is selected
      if (sel.rangeCount === 0) {
        return button.action(selectionModel);
      }

      var range = sel.getRangeAt(0);
      // determine if range is in editor
      // if not, do nothing
      if (!range.isValid() || !dom.containsNode(viewElem, range.startContainer)
          || !dom.containsNode(viewElem, range.endContainer))
        return false;

      button.action(selectionModel, range);
    });

    this._elem = $button[0];
  }

  return this._elem;
};

Button.prototype.action = function(selectionModel, range) {
  throw new exceptions.ImplementationMissingException(
      'Override ButtonPlugin.prototype.action()');
};

exports.Divider = Divider;

function Divider(editor) {
  ControlElement.call(this, editor);
}

Divider.prototype.getElement = function() {
  if (this._elem === null) {
    var $divider = $('<div class="mesh-divider" />');
    var divider = this;

    this._elem = $divider[0];
  }

  return this._elem;
};
