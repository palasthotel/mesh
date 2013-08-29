(function() {
  'use strict';

  // export functionality
  if (typeof module === 'object')
    module.exports = Editor;
  else
    window.Editor = Editor;

  /**
   * Initialize new `Editor`.
   * 
   * @param {Element}
   *                elem
   * @param {Array}
   *                [historyStack]
   * @param {Number}
   *                [historySize]
   */
  function Editor(elem, historyStack, historySize) {
    var isSelf = this instanceof Editor;
    if (!isSelf)
      return new Editor(el, historyStack);
    if (!elem)
      throw new TypeError('expects an element');
    this.history = new History(historyStack || []);
    this.history.max(historySize || 100);
    this.container = elem;
  }

  // Event emitter
  Emitter(Editor.prototype);

  /**
   * Get editor contents.
   * 
   * @return {String}
   */
  Editor.prototype.contents = function() {
    return this.container.innerHTML;
  };

  /**
   * Is editing enabled?
   * 
   * @return {Boolean}
   */
  Editor.prototype.isEnabled = function() {
    return this.container.contentEditable == 'true';
  };

  /**
   * Toggle editor state.
   * 
   * @return {Editor}
   */
  Editor.prototype.toggleEnabled = function() {
    if (this.isEnabled())
      this.setEnabled(false)
    else
      this.setEnabled(true);

    return this;
  };

  /**
   * Enable or disable editing.
   * 
   * @return {Editor}
   */
  Editor.prototype.setEnabled = function(bool) {
    if (bool) {
      this.container.contentEditable = true;
      this.events.bind('keyup', 'onstatechange');
      this.events.bind('click', 'onstatechange');
      this.events.bind('focus', 'onstatechange');
      this.events.bind('paste', 'onchange');
      this.events.bind('input', 'onchange');
      this.emit('enable');
    } else {
      this.container.contentEditable = false;
      this.events.unbind();
      this.emit('disable');
    }

    return this;
  };

  /**
   * Get range.
   * 
   * TODO: x-browser
   * 
   * @return {Range}
   */
  Editor.prototype.range = function() {
    return document.createRange();
  };

  /**
   * Get selection.
   * 
   * TODO: x-browser
   * 
   * @return {Selection}
   */

  Editor.prototype.selection = function() {
    return window.getSelection();
  };

  /**
   * Undo.
   * 
   * @return {Editor}
   */
  Editor.prototype.undo = function() {
    var buf = this.history.prev();
    this.el.innerHTML = buf || this.el.innerHTML;
    buf || this.emit('state');
    return this;
  };

  /**
   * Redo.
   * 
   * @return {Editor}
   */
  Editor.prototype.redo = function() {
    var buf = this.history.next();
    var curr = this.el.innerHTML;
    this.el.innerHTML = buf || curr;
    buf || this.emit('state');
    return this;
  };

  /**
   * Execute the given `cmd` with `val`.
   * 
   * @param {String}
   *                cmd
   * @param {Mixed}
   *                val
   * @return {Editor}
   */
  Editor.prototype.execute = function(cmd, val) {
    document.execCommand(cmd, false, val);
    this.onstatechange();
    return this;
  };

  /**
   * Query `cmd` state.
   * 
   * @param {String}
   *                cmd
   * @return {Boolean}
   */
  Editor.prototype.state = function(cmd) {
    var length = this.history.vals.length - 1, stack = this.history;

    if ('undo' == cmd)
      return 0 < stack.i;
    if ('redo' == cmd)
      return length > stack.i;
    return document.queryCommandState(cmd);
  };

  /**
   * Emit `state`.
   * 
   * @param {Event}
   *                e
   * @return {Editor}
   */
  Editor.prototype.onstatechange = function(e) {
    this.emit('state', e);
    return this;
  };

  /**
   * Emit `change` and push current `buf` to history.
   * 
   * @param {Event}
   *                e
   * @return {Editor}
   */
  Editor.prototype.onchange = function(e) {
    this.history.add(this.contents());
    return this.emit('change', e);
  };

})();
