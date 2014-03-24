exports.ControlPlugin = ControlPlugin;

function ControlPlugin(title, hint) {
  this._title = title;
  this._hint = hint;
};

ControlPlugin.prototype.getTitle = function() {
  return this._title;
};

ControlPlugin.prototype.getHint = function() {
  return null;
};

ControlPlugin.prototype.createControlElement = function() {
  var button = document.createElement('button');
  button.innerHTML = this.getTitle();

  if (this.getHint() !== null) {
    $(button).attr('title', this.getHint());
  }

  return button;
};

/**
 * Override this method to change the action of this plugin.
 */
ControlPlugin.prototype.action = function(editor, selection) {
};
