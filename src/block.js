(function() {
  'use strict';

  // export functionality
  if (typeof module === 'object')
    module.exports = Block;
  else
    window.Block = Block;

  /**
   * Block around a given node.
   */
  function Block(editor, node) {
    if (!(this instanceof Block))
      return new Block(editor, node);

    this.editor = editor; // refs to editor
    this.node = node; // and node

    this.handle = node.children[0]; // div.handle
    this.handle.contentEditable = false;
    this.content = node.children[1]; // div.content
    this.controls = node.children[2]; // div.controls
    this.controls.contentEditable = false;
  }

  /**
   * Creates a block of a given type. E.g. p, blockquote, etc.
   */
  Block.create = function create(editor, type) {
    var node = document.createElement('div');
    node.classList.add('block');
    var handle = '<div class="handle"></div>';
    var content = '<div class="' + type + '"></div>';
    var controls = '<div class="controls"><div class="remove"></div></div>';
    node.innerHTML = handle + content + controls;

    return new Block(editor, node);
  };

  /**
   * Insert a line break at the given selection.
   */
  Block.prototype.insertLineBreak = function insertLineBreak(selection) {
    var sel;
    if (typeof selection == 'undefined')
      sel = this.editor.selection();
    else
      sel = selection;

    var before = document.createDocumentFragment();

    // before selection
    var brkBefore = document.createElement('div');
    brkBefore.innerText = sel.anchorNode.data.substring(0, sel.anchorOffset);
    console.log(brkBefore);

    // end of line
    var brkAfter = document.createElement('div');
    brkAfter.innerText = sel.anchorNode.data.substring(sel.anchorOffset);
    console.log(brkAfter);

    before.appendChild(brkBefore);

    var parent = this.node.parentNode;
    var child = parent.children[0];
    while (child != null && child != this.node.nextSibling) {
      var next = child.nextSibling;
      parent.removeChild(child);

      if (child == this.node) {
        parent.insertBefore(brkAfter, next);
      } else {
        before.appendChild(child);
      }

      child = child.nextSibling;
    }

    var main = Editor.createMain('paragraph');
    main.appendChild(before);
    var nodeBefore = Editor.createBlock(main);

    $(parent.parentNode).before(nodeBefore.block);
  };

  Block.prototype.length = function length() {
    this.content.children.length;
  };

  Block.prototype.get = function get(i) {
    if (i >= this.length())
      throw new Error('index out of bounds');

    this.content.children[i];
  };

  Block.prototype.append = function append(node) {
    this.content.appendChild(node);
  };

  Block.prototype.appendBreak = function appendBreak(html) {
    var brk = document.createElement('div');
    brk.classList.add('break');
    brk.innerHTML = html;
    this.append(brk);
  };

  Block.prototype.prepend = function prepend(node) {
    if (this.length == 0)
      throw new Error('empty block');

    var first = this.get(0);
    this.content.insertBefore(node, first);
  };

  Block.prototype.setFocus = function setFocus(bool) {
    if (bool)
      this.node.classList.add('focus');
    else
      this.node.classList.remove('focus');
  };
})();
