var dom = require('./dom.js');
var exceptions = require('./exceptions.js');
var oo = require('./oo.js');

// ControlElement

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

  this._enabled = true;
  this._activated = false;

  ControlElement.call(this, editor);
}

oo.extend(Button, ControlElement);

Button.prototype.setEnabled = function(enabled) {
  if (!enabled) {
    $(this.getElement()).addClass('disabled')
  } else {
    $(this.getElement()).removeClass('disabled');
  }

  this._enabled = enabled;
};

Button.prototype.isEnabled = function() {
  return this._enabled;
};

Button.prototype.setActivated = function(activated) {
  if (activated) {
    $(this.getElement()).addClass('active')
  } else {
    $(this.getElement()).removeClass('active');
  }

  this._activated = activated;
};

Button.prototype.isActivated = function() {
  return this._activated;
};

Button.prototype.getElement = function() {
  if (this._elem === null) {
    var $button = $('<button class="mesh-button disabled" title="' + this._hint
        + '">' + this._content + '</button>');
    var button = this;

    $button.click(function onClick(e) {
      e.preventDefault();

      // do nothing if not enabled
      if (!button.isEnabled()) {
        return;
      }

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

Button.prototype.selectionChange = function() {
  var sel = rangy.getSelection();
  if (sel.rangeCount === 0) {
    return this.setActivated(false);
  }

  var range = sel.getRangeAt(0);
  range
};

exports.Divider = Divider;

function Divider(editor) {
  ControlElement.call(this, editor);
}

oo.extend(Divider, ControlElement);

Divider.prototype.getElement = function() {
  if (this._elem === null) {
    var $divider = $('<div class="mesh-divider" />');

    this._elem = $divider[0];
  }

  return this._elem;
};

exports.Dropdown = Dropdown;

function Dropdown(editor, hint) {
  ControlElement.call(this, editor);
  this._hint = hint;
}

oo.extend(Dropdown, ControlElement);

Dropdown.prototype.getElement = function() {
  if (this._elem === null) {
    var $dropdown = $('<select class="mesh-dropdown" disabled="disabled" title="'
        + this._hint + '" />');

    this._elem = $dropdown[0];
  }

  return this._elem;
}
