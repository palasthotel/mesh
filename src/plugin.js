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
    var $button = $('<div class="mesh-button" title="' + this._hint + '">'
        + this._content + '</div>');
    var button = this;

    $button.click(function() {
      button.action();
    });

    this._elem = $button[0];
  }

  return this._elem;
};

Button.prototype.action = function() {
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
