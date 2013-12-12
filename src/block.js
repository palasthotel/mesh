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
  function Block(editor, elem) {
    if (!(this instanceof Block))
      return new Block(editor, elem);

    this.editor = editor; // refs to editor
    this.node = elem; // and node

    this.handle = elem.children[0]; // div.handle
    this.handle.contentEditable = false;
    this.content = elem.children[1]; // div.content
    this.controls = elem.children[2]; // div.controls
    this.controls.contentEditable = false;

    this.type = this.content.nodeName.toLowerCase();
    if (this.type === 'div')
      this.type = this.content.classList[0];

    this.attributes = [];

    var block = this;
    $(this.controls).find('.remove').unbind().bind('click', function() {
      block.remove();
    });

    $(this.controls).find('.attrs').unbind().bind('click', function() {
      editor.editAttributes(block);
    });
  }

  var knownTypes = [ 'p', 'ul', 'ol', 'blockquote', 'h1', 'h2', 'h3', 'pre' ];

  /**
   * Creates a block of a given type. E.g. p, blockquote, etc.
   */
  Block.create =
      function create(editor, type) {
        var node = document.createElement('div');
        node.classList.add('block');

        var handle = '<div class="handle"></div>';
        var content = '';
        if (knownTypes.indexOf(type) > -1) {
          content = '<' + type + '><br /></' + type + '>';
        } else {
          content = '<div class="' + type + '"><br /></div>';
        }
        var controls =
            '<div class="controls"><div class="remove"></div><div class="attrs"></div></div>';

        node.innerHTML = handle + content + controls;

        return new Block(editor, node);
      };

  Block.prototype.transformType =
      function transformType(type) {
        if (this.type === type)
          return;

        var i;
        var innerHTML = '';
        // if transforming from a list to non-list
        if ((this.type === 'ul' || this.type === 'ol') && type !== 'ul'
            && type !== 'ol') {
          for (i = 0; i < this.content.children.length; i++) {
            innerHTML += this.content.children[i].innerHTML;
            if (i !== this.content.children.length - 1)
              innerHTML += '<br />';
          }
        }
        // if transforming from a non-list to a list
        else if ((type === 'ul' || type === 'ol') && this.type !== 'ul'
            && this.type !== 'ol') {
          var lines = this.content.innerHTML.split(/<br ?\/?>/ig);
          for (i = 0; i < lines.length; i++) {
            innerHTML += '<li>' + lines[i] + '</li>';
          }
        } else {
          innerHTML = this.content.innerHTML;
        }

        this.type = type;

        var newNode = null;
        if (knownTypes.indexOf(type) > -1)
          newNode = document.createElement(type);
        else {
          newNode = document.createElement('div');
          $(newNode).addClass(type);
        }

        newNode.innerHTML = innerHTML; // set contents

        this.node.replaceChild(newNode, this.content);
        this.content = newNode;

        // set the caret
        Caret.moveToBeginning(this.content, rangy.getSelection());

        this.editor.emitEvent('state');
        this.editor.emitEvent('change');
      };

  /**
   * @returns {String}
   */
  Block.prototype.getType = function getType() {
    return this.type;
  };

  /**
   * @returns {Node}
   */
  Block.prototype.getBaseNode = function getBaseNode() {
    return this.node;
  };

  Block.prototype.getHandleNode = function getHandleNode() {
    return this.handle;
  };

  /**
   * @returns {Node}
   */
  Block.prototype.getContentNode = function getContentNode() {
    return this.content;
  };

  /**
   * @returns {Node}
   */
  Block.prototype.getControlsNode = function getControlsNode() {
    return this.controls;
  };

  /**
   * Change the type.
   */
  Block.prototype.setType = function setType(type) {
    if (type === this.getType())
      return;

    this.type = type;

    var newContent = null;
    if (knownTypes.indexOf(type) > -1) {
      newContent = document.createElement(type);
    } else {
      newContent = document.createElement('div');
      newContent.classList.add(type);
    }

    var child = null;
    for ( var i = 0; i < this.content.childNodes.length; i++) {
      child = this.content.removeChild(this.content.childNodes.item(i));
      newContent.appendChild(child);
    }

    this.node.removeChild(this.content);
    this.content = newContent;

    this.node.insertBefore(newContent, this.controls);
  };

  /**
   * Insert a line break at the given selection.
   */
  Block.prototype.insertBreak =
      function insertBreak(sel) {
        if (typeof sel === 'undefined')
          throw new Error('no selection');

        var anchor = sel.anchorNode;
        var br = document.createElement('br');
        var grandpa = null;

        if (sel.anchorOffset === 0 && anchor === anchor.parentNode.firstChild) {
          // if the caret is at the beginning of the element, insert the <br>
          // in front of the parent node
          grandpa = anchor.parentNode.parentNode;
          grandpa.insertBefore(br, anchor.parentNode);

          console.log('1st');
        } else if (sel.anchorOffset === anchor.length
            && anchor === anchor.parentNode.lastChild) {
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
    if (node.className === 'break' && this.content === node.parentNode)
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

  Block.prototype.getWordCount = function getWordCount() {
    var text = getNodeText(this.content).trim();
    var words = text.split(/\s+/);
    var wc = 0;
    for ( var i = 0; i < words.length; i++) {
      if (words[i].length > 0)
        wc++;
    }
    return wc;
  }

  Block.prototype.toHTML = function toHTML() {
    return this.toXML();
  };

  function nodeToXMLString(node) {
    try {
      // Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
      return (new XMLSerializer()).serializeToString(node);
    } catch (e) {
      try {
        // Internet Explorer.
        return node.xml;
      } catch (e) {
        // Other browsers without XML Serializer
        throw new Error('XMLSerializer not supported');
      }
    }

    return false;
  }

  Block.prototype.toXML = function toXML() {
    var str = '<' + this.content.nodeName.toLowerCase();
    var i;

    for (i = 0; i < this.attributes.length; i++) {
      str += ' ';
      str += escapeXML(this.attributes[i].key);
      str += '="' + escapeXML(this.attributes[i].value) + '"';
    }

    str += '>';

    for (i = 0; i < this.content.childNodes.length; i++) {
      str += nodeToXMLString(this.content.childNodes[i]);
    }

    str += '</' + this.content.nodeName.toLowerCase() + '>';
    return str;
  };

  Block.prototype.remove = function remove() {
    var block = this;
    var editor = this.editor;
    var blocks = this.editor.blocks;

    // fade out and then remove this node from dom
    $(this.node).fadeOut(function() {
      $(this).remove();

      rangy.getSelection().removeAllRanges();

      // remove block from editor.blocks
      var i = blocks.indexOf(block);
      if (i > -1) {
        blocks.splice(i, 1);
      }

      if (blocks.length == 0) {
        var newBlock = Block.create(editor, 'p');
        editor.appendBlock(newBlock);
      }

      editor.emitEvent('change');
    });
  }
})();
