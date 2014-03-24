
function ButtonPlugin(title, hint) {
  this._title = hint;
  this._hint = hint;
};

ButtonPlugin.prototype.getName = function() {
  return this._name;
};

ButtonPlugin.prototype.getHint = function() {
  return null;
};

ButtonPlugin.prototype.getElement = function() {
  return document.createElement('button');
};
