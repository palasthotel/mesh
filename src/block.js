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
    if (typeof selection === 'undefined')
      sel = this.editor.selection();
    else
      sel = selection;

    console.log(sel);

    var brkBefore = Block.getBreakForChildNode(sel.anchorNode);
    var brkAfter = Editor.createBreak();

    function containsNode(a, b) {
      if (Node && Node.prototype.contains)
        return a.contains(b);

      return !!(a.compareDocumentPosition(b) & 16)
    }

    var textAfter = null;
    // Recursively walk down the DOM tree and split the node at the selection
    function splitNode(nodeBefore, nodeAfter, selection) {
      var node = nodeBefore.firstChild;
      var next = null;
      var before = null;
      var after = null;
      var splitOccurred = false;
      var splitHere = false;
      var anchor = selection.anchorNode;

      // Walk through all children of nodeBefore and check if they contain the
      // anchor
      while (node !== null) {
        next = node.nextSibling;

        // Do we need to split within the current node?
        splitHere = containsNode(node, anchor);

        if (splitHere) {
          if (node.nodeType === 3) { // text node
            // split the text node, append it to nodeAfter
            textAfter = anchor.splitText(selection.anchorOffset);
            anchor.parentNode.removeChild(textAfter);
            nodeAfter.appendChild(textAfter);
          } else {
            before = node;
            after = document.createElement(node.nodeName);

            // also copy the attributes
            var attrs = before.attributes;
            var len = attrs.length;
            var attr;
            for ( var i = 0; i < len; i++) {
              attr = attrs[i];
              if (!attr.specified)
                continue;

              after.setAttribute(attr.nodeName, attr.nodeValue);
            }

            splitNode(before, after, selection);

            nodeAfter.insertBefore(after);
          }

          splitOccurred = true;
        } else if (splitOccurred) {
          // move that node to brkAfter
          nodeBefore.removeChild(node);
          nodeAfter.appendChild(node);
        }

        node = next;
      }
    }

    splitNode(brkBefore, brkAfter, sel);

    // append the newly created .break
    var brkNext = brkBefore.nextSibling;
    if (brkNext !== null)
      brkBefore.parentNode.insertBefore(brkAfter, brkNext);
    else
      brkBefore.parentNode.appendChild(brkAfter);

    // move cursor to next line
    var range = rangy.createRange();
    range.setStart(textAfter, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  /**
   * @returns DIV node with class "break" that contains the given node
   */
  Block.getBreakForChildNode = function getBreakForChildNode(node) {
    if (node === null)
      return null;
    if (node.className === 'break')
      return node;

    return Block.getBreakForChildNode(node.parentNode);
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
