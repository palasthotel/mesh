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
  Caret.moveToBeginning = function moveToBeginning(node, selection) {
    var sel = null;
    if (typeof selection === 'undefined') {
      sel = rangy.getSelection();
    } else {
      sel = selection;
    }

    var range = rangy.createRange();
    range.setStart(node, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  /**
   * Moves the caret to the ending of the given node.
   */
  Caret.moveToEnding = function moveToEnding(node, selection) {
    var sel = null;
    if (typeof selection === 'undefined') {
      sel = rangy.getSelection();
    } else {
      sel = selection;
    }

    var range = rangy.createRange();
    var pos = (node.innerText || node.data).length;
    range.setStart(node, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();
