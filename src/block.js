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
    var content = '<' + type + '></' + type + '>';
    var controls = '<div class="controls"><div class="remove"></div></div>';
    node.innerHTML = handle + content + controls;

    return new Block(editor, node);
  };

  /**
   * Insert a line break at the given selection.
   */
  Block.prototype.insertBreak =
      function insertBreak(sel) {
        if (typeof sel === 'undefined')
          throw new Error('no selection');

        console.log(sel);

        var anchor = sel.anchorNode;
        var br = document.createElement('br');
        var grandpa = null;

        if (sel.anchorOffset === 0
            && anchor.isSameNode(anchor.parentNode.firstChild)) {
          // if the caret is at the beginning of the element, insert the <br>
          // in front of the parent node
          grandpa = anchor.parentNode.parentNode;
          grandpa.insertBefore(br, anchor.parentNode);

          console.log('1st');
        } else if (sel.anchorOffset === anchor.length
            && anchor.isSameNode(anchor.parentNode.lastChild)) {
          // if the caret is at the end of the element, insert the <br> after
          // the anchor
          grandpa = anchor.parentNode.parentNode;
          grandpa.appendChild(br);
          grandpa.appendChild(document.createElement('br'));

          Caret.moveToEnding(grandpa, sel);

          console.log('last');
        } else if (anchor.nodeType === 3) {
          // if the caret is in a text node, split it and insert the line break
          // in between
          var textNodeAfterSplit = anchor.splitText(sel.anchorOffset);
          anchor.parentNode.insertBefore(br, textNodeAfterSplit);

          // move caret to beginning of next line
          Caret.moveToBeginning(textNodeAfterSplit, sel);

          console.log('text');
        } else {
          // if we are in a normal node,
          var i = sel.anchorOffset;
          var nodeAfter = anchor.childNodes[i];

          anchor.insertBefore(br, nodeAfter);

          // move caret to beginning of next line
          Caret.moveToBeginning(nodeAfter, sel);

          console.log('normal');
        }
      };

  /**
   * @returns DIV node with class "break" that contains the given selection
   */
  Block.prototype.getSelectedBreak = function getSelectedBreak(sel) {
    var node = sel.anchorNode;

    if (node === null)
      return null;
    if (node.className === 'break')
      return node;

    return this.getSelectedBreak({
      anchorNode : node.parentNode
    });
  };

  /**
   * @returns true, if the selection is at the beginning of
   */
  Block.prototype.isAtBeginning = function isAtBeginning(sel) {
    if (sel.anchorOffset !== 0)
      return false;

    var node = sel.anchorNode;
    if (node === null)
      return false;
    if (node.className === 'break' && this.content.isSameNode(node.parentNode))
      return true;

    return this.isAtBeginning(node.parentNode);
  };

  Block.isSelectionAfterBreak = function isSelectionAfterBreak(sel) {
    var anchor = sel.anchorNode;

    // TODO what to do at beginning of <b>? <br /> is inserted into <b>...
    var prev = null;
    if (anchor.nodeType === 3) { // text node
      prev = anchor.previousSibling;
      return prev && prev.nodeName === 'BR';
    }

    prev = anchor.children[sel.anchorOffset - 1];
    return prev && prev.nodeName === 'BR';
  };

  /**
   * @returns breaks within this block
   */
  Block.prototype.getBreaks = function getBreaks() {
    return this.content.children;
  };

  /**
   * @returns number of breaks
   */
  Block.prototype.length = function length() {
    return this.content.children.length;
  };

  /**
   * @returns break at position `i`
   */
  Block.prototype.get = function get(i) {
    if (i >= this.length())
      throw new Error('index out of bounds');

    return this.content.children[i];
  };

  /**
   * Inserts a node at the end of this block.
   */
  Block.prototype.append = function append(node) {
    this.content.appendChild(node);
  };

  /**
   * Inserts a node at the beginning of this block.
   * 
   * TODO needed?
   */
  Block.prototype.prepend = function prepend(node) {
    if (this.length() === 0)
      this.append(node);

    var first = this.get(0);
    this.content.insertBefore(node, first);
  };

  Block.prototype.setHTMLContent = function setHTMLContent(html) {
    this.content.innerHTML = html;
  };

  /**
   * Sets/unsets the focus.
   */
  Block.prototype.setFocus = function setFocus(bool) {
    if (bool)
      this.node.classList.add('focus');
    else
      this.node.classList.remove('focus');
  };

  Block.prototype.getPreviousBlock = function getPreviousBlock() {
    var i = 0;
    var blocks = this.editor.blocks;

    for (i = 0; i < blocks.length; i++) {
      if (blocks[i] === this) {
        if (i === 0)
          return null;
        break;
      }
    }

    return blocks[i];
  };

  Block.prototype.getNextBlock = function getNextBlock() {
    var i = 0;
    var blocks = this.editor.blocks;

    for (i = 0; i < blocks.length; i++) {
      if (blocks[i] === this)
        break;
    }

    if (blocks.length > i + 1)
      return blocks[i + 1];

    return null;
  };

  Block.prototype.getNumberOfWords = function getNumberOfWords() {
    var text = this.content.innerText.trim();
    return text.split(/\s+/).length;
  }
})();
