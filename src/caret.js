(function() {
  'use strict';

  var Caret = {};

  // export functionality
  if (typeof module === 'object')
    module.exports = Caret;
  else
    window.Caret = Caret;

  /**
   * Moves the caret to the beginning of the given node.
   */
  Caret.moveToBeginning = function moveToBeginning(node, sel) {
    var range = rangy.createRange();
    range.setStart(node, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  /**
   * Moves the caret to the ending of the given node.
   */
  Caret.moveToEnding = function moveToEnding(node, sel) {
    console.log('end?')
    var range = rangy.createRange();
    var pos = 0;

    if (node.nodeType === 3)
      pos = node.length;
    else {
      pos = node.childNodes.length;
    }

    range.setStart(node, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();
