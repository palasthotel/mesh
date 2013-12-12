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
   * @param {Attributes}
   *                attributes
   * @param {Array}
   *                [historyStack]
   * @param {Number}
   *                [historySize]
   */
  function Editor(elem, attributes, historyStack, historySize) {
    if (!(this instanceof Editor))
      return new Editor(elem, attributes, historyStack, historySize);
    if (!elem)
      throw new TypeError('expects an element');

    var editor = this; // ref to self

    this.history = new History(historyStack || []);
    this.history.setMaximumEntries(historySize || 100);

    this.container = elem;
    this.attributes = attributes;

    this.setEnabled(true);

    this.blocks = [];
    this.activeBlock = null;

    var i, len = this.container.children.length;
    for (i = 0; i < len; i++) {
      this.blocks.push(new Block(this, this.container.children[i]));
    }

    $(this.container).sortable({
      placeholder : 'placeholder', // css class .placeholder
      axis : 'y',
      receive : function(e, ui) {
        console.log(e, ui);
        editor.emitEvent('add-block');
      },
      stop : function(e) {
        rangy.getSelection().removeAllRanges();
        editor.updateBlocks();
        editor.emitEvent('sort');
      }
    });

    // update active block
    $(this.container).bind('click keydown', function() {
      var sel = rangy.getSelection();
      var block = editor.getSelectedBlock(sel);
      if (block !== null)
        editor.activeBlock = block;
    });
  }

  // Event emitter
  Emitter(Editor.prototype);

  Editor.prototype.setContent = function setContent(html) {
    var editor = this;
    if (typeof html != 'string')
      throw new Error('not a string');

    var c = document.createElement('div');
    c.innerHTML = html;

    var i, len = c.children.length;
    for (i = 0; i < len; i++) {
      var node = c.children[i];
      var type = node.nodeName.toLowerCase();
      var block = Block.create(editor, type);

      var html = node.innerHTML;
      block.setHTMLContent(html);

      this.appendBlock(block);
    }
  };

  Editor.prototype.appendBlock = function appendBlock(block) {
    this.blocks.push(block);
    this.container.appendChild(block.node);
  };

  /**
   * Get editor contents.
   * 
   * @return {String}
   */
  Editor.prototype.getContent = function() {
    return this.container.innerHTML;
  };

  /**
   * Is editor enabled?
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
    var $c = $(this.container);
    if (bool) {
      this.container.contentEditable = true;
      $c.bind('keydown', $.proxy(this.onkeydown, this));
      $c.bind('keyup click focus', $.proxy(this.onstatechange, this));
      $c.bind('paste input', $.proxy(this.onchange, this));
      this.emitEvent('enabled');
    } else {
      this.container.contentEditable = false;
      $c.unbind();
      this.emitEvent('disabled');
    }

    return this;
  };

  Editor.prototype.getActiveBlock = function() {
    return this.activeBlock;
  };

  Editor.prototype.getSelectedBlock = function(selection) {
    var n = selection.anchorNode;

    while (!n.classList || !n.classList.contains('block')) {
      n = n.parentNode;
    }

    var i = 0;
    var len = this.blocks.length;
    var block = null;
    for (i = 0; i < len; i++) {
      block = this.blocks[i];
      if (block.node === n)
        return block;
    }

    return null;
  };

  /**
   * Undo.
   * 
   * @return {Editor}
   */
  Editor.prototype.undo = function() {
    var buf = this.history.prev();
    this.container.innerHTML = buf || this.container.innerHTML;
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
    var curr = this.container.innerHTML;
    this.container.innerHTML = buf || curr;
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

  function isChildOf(node, ancestorName) {
    if (!node)
      return false;
    if (node.nodeType === 1 && node.nodeName === ancestorName)
      return true;
    if (!node.parentNode)
      return false;
    return isChildOf(node.parentNode, ancestorName);
  }

  /**
   * Query `cmd` state.
   * 
   * @param {String}
   *                cmd
   * @return {Boolean}
   */
  Editor.prototype.getState = function(cmd) {
    var node = rangy.getSelection().anchorNode;
    if (cmd === 'link') {
      return isChildOf(node, 'A');
    } else if (cmd === 'p') {
      return isChildOf(node, 'P');
    } else if (cmd === 'quote') {
      return isChildOf(node, 'BLOCKQUOTE');
    } else if (cmd === 'ul') {
      return isChildOf(node, 'UL');
    } else if (cmd === 'ol') {
      return isChildOf(node, 'OL');
    } else if (cmd === 'code') {
      return isChildOf(node, 'PRE');
    }

    var length = this.history.vals.length - 1;
    var stack = this.history;

    if (cmd === 'undo')
      return 0 < stack.i;
    if (cmd === 'redo')
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
    this.emitEvent('state', e);
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
    this.history.add(this.getContent());

    this.emitEvent('change', e);
    return this;
  };

  Editor.prototype.onkeydown = function(e) {
    console.log(e.keyCode);

    if (e.keyCode === 13 || e.keyCode === 10) { // return/enter key
      var sel = rangy.getSelection();

      // TODO handle non-collapsed selections
      if (!sel.isCollapsed)
        throw new Error('not collapsed! TO BE HANDLED');

      prevent(e); // prevent default browser behaviour

      var block = this.getSelectedBlock(sel);
      // If the caret is behind another block, insert a new block
      if (Block.isSelectionAfterBreak(sel)) {
        console.log('block');
        block.insertBreak(sel);
      } else { // otherwise insert a line break
        // insert line break
        block.insertBreak(sel);
      }
    }
    return this;
  };

  function isEmptyNode(node) {
    return node !== null && node.children && node.children.length === 1
        && node.children[0].nodeName === 'BR';
  }

  function isNthChild(node, n) {
    var siblings = node.parentNode.children;
    var nth = siblings[n - 1];
    return node === nth;
  }

  function isLastChild(node) {
    var siblings = node.parentNode.children;
    return siblings[siblings.length - 1] === node;
  }

  function prevent(e) {
    e.preventDefault();
  }

  Editor.createBreak = function createBreak() {
    var brk = document.createElement('div');
    brk.classList.add('break');
    return brk;
  };

  Editor.createMain = function createMain(clss) {
    var main = document.createElement('div');
    main.classList.add(clss);
    return main;
  };

  Editor.createBlock = function createBlock(main) {
    var block = document.createElement('div');
    var handle = document.createElement('div');
    var controls = document.createElement('div');

    block.classList.add('block');
    handle.classList.add('handle');
    controls.classList.add('controls');

    block.appendChild(handle);
    block.appendChild(main);
    block.appendChild(controls);

    return {
      block : block,
      handle : handle,
      main : main,
      controls : controls
    };
  };

  Editor.createEmptyBlock = function createEmptyBlock(clss) {
    var main = Editor.createMain('paragraph');
    main.innerHTML = '<br />';
    return Editor.createBlock(main);
  };

  Editor.prototype.insertBlockAfter = function insertBlockAfter(block) {

    console.log('inserted')
    // block.node
  };

  Editor.prototype.insertBlockAt = function insertBlockAt(i, block) {

  };

  Editor.prototype.updateBlocks = function updateBlocks() {
    var i, j;
    var block = null;

    var bs = this.blocks.slice();

    for (i = 0; i < bs.length; i++) {
      block = bs[i];

      for (j = 0; j < bs.length; j++) {
        if (block.node === this.container.children[j]) {
          this.blocks[j] = block;
          break;
        }
      }
    }
  };

  Editor.prototype.editAttributes = function editAttributes(block) {
    this.activeBlock = block;
    this.attributes.setAttributes(block.attributes);
    this.attributes.setVisible(true);
  };

  Editor.prototype.getWordCount = function getWordCount() {
    var i = 0;
    var total = 0;
    var block = null;

    for (i = 0; i < this.blocks.length; i++) {
      block = this.blocks[i];
      total += block.getWordCount();
    }

    return total;
  };

  Editor.prototype.toHTML = function toHTML() {
    var i = 0;
    var source = [];
    var block = null;

    for (; i < this.blocks.length; i++) {
      block = this.blocks[i];
      source.push(block.toHTML());
    }

    return source.join('\n');
  };

  Editor.prototype.toXML = function toXML() {
    var i = 0;
    var source = [];
    var block = null;

    for (; i < this.blocks.length; i++) {
      block = this.blocks[i];
      source.push(block.toXML());
    }

    return source.join('\n');
  };
})();
