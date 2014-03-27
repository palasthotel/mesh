var dom = require('./dom.js');
var exceptions = require('./exceptions.js');
var oo = require('./oo.js');
var view = require('./view.js');
var model = require('./model.js');

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
 * Override this method in order to do something when the selection changes.
 */
ControlElement.prototype.selectionChange = function() {
};

/**
 * Override this method in order to do something when the editor's content
 * changes.
 */
ControlElement.prototype.contentChange = function() {
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

Button.prototype.selectionChange = function() {
};

exports.Divider = Divider;

function Divider(editor) {
  ControlElement.call(this, editor);
}

oo.extend(Divider, ControlElement);

Divider.prototype.getElement = function() {
  if (this._elem === null) {
    var $divider = $('<span class="mesh-divider" />');

    this._elem = $divider[0];
  }

  return this._elem;
};

exports.Dropdown = Dropdown;

function Dropdown(editor, hint, options) {
  this._hint = hint;
  this._options = options;
  ControlElement.call(this, editor);
}

oo.extend(Dropdown, ControlElement);

Dropdown.prototype.getElement = function() {
  if (this._elem === null) {
    var $dropdown = $('<select class="mesh-dropdown" disabled="disabled" title="'
        + this._hint + '" />');
    var dropdown = this;

    var option = null;
    // append all options
    for (var i = 0; i < this._options.length; i++) {
      option = this._options[i];
      $dropdown.append('<option value="' + option.value + '">' + option.label
          + '</option>');
    }

    $dropdown.change(function(e) {
      dropdown.action(this.value);
    });

    this._elem = $dropdown[0];
  }

  return this._elem;
}

Dropdown.prototype.setEnabled = function(enabled) {
  if (enabled) {
    $(this.getElement()).removeAttr('disabled');
  } else {
    $(this.getElement()).attr('disabled', 'disabled');
  }
}

// BlockType

exports.BlockType = BlockType;

function BlockType(elementName, value, label) {
  this._elementName = elementName.toUpperCase();
  this._value = value;
  this._label = label;
}

BlockType.prototype.getLabel = function() {
  return this._label;
};

BlockType.prototype.getValue = function() {
  return this._value;
};

/**
 * Override this method for more specialized block types.
 */
BlockType.prototype.matches = function(blockModel) {
  return blockModel.getElement().nodeName === this._elementName;
};

BlockType.prototype.createViewFor = function(blockModel, documentView) {
  var blockType = this;
  var blockView = new view.BlockView(blockModel, documentView, this);

  $(blockView.getElement()).keydown(function(e) {
    return blockType.onKeyPressed(e, documentView, blockView);
  });

  $(blockView.getElement()).bind('paste', function(e) {
    return blockType.onPaste(e, documentView, blockView);
  });

  return blockView;
};

BlockType.prototype.convertFrom = function(blockView, documentView) {
  var blockType = this;
  var modelElem = blockView.getModel().getElement();
  var newModelElem = document.createElement(this._elementName);

  // handle lists
  if (dom.hasType(modelElem, 'UL') || dom.hasType(modelElem, 'OL')) {
    $(modelElem).find('li').append('<br />');
    var html = modelElem.innerHTML;
    html = html.replace(/<\/?li>/ig, '');
    newModelElem.innerHTML = html;
  } else if (dom.hasType(newModelElem, 'UL') || dom.hasType(newModelElem, 'OL')) {
    var html = modelElem.innerHTML;
    console.log(html);
    html = html.split('<br>');
    for (var i = 0; i < html.length; i++) {
      $(newModelElem).append('<li>' + html[i].trim() + '</li>');
    }
  } else {
    // default elements like <p>s
    dom.moveChildNodes(modelElem, newModelElem);
  }
  dom.replaceNode(modelElem, newModelElem);

  blockView._type = this;
  blockView._model = new model.BlockModel(newModelElem);
};

BlockType.prototype.onKeyPressed = function(e, documentView, blockView) {
  if (e.keyCode === 13) {
    return this.onReturnPressed(e, documentView, blockView);
  }

  if (e.keyCode === 8) {
    return this.onBackspacePressed(e, documentView, blockView);
  }

  if (e.keyCode === 46) {
    return this.onDeletePressed(e, documentView, blockView);
  }

  if (e.keyCode === 9) {
    return this.onTabPressed(e, documentView, blockView);
  }

  return true;
};

BlockType.prototype.onReturnPressed = function(e, documentView, blockView) {
  e.preventDefault();
};

BlockType.prototype.onBackspacePressed = function(e, documentView, blockView) {
  console.log('backspace');
  e.preventDefault();
};

BlockType.prototype.onDeletePressed = function(e, documentView, blockView) {
  e.preventDefault();
};

BlockType.prototype.onTabPressed = function(e, documentView, blockView) {
  console.log(documentView.getSelectionModel());
};

BlockType.prototype.onPaste = function(e, documentView, blockView) {
  // accept paste events
};
