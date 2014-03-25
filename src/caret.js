var caret = exports;

/**
 * Moves the caret to the beginning of the given node.
 */
caret.moveToBeginning = function moveToBeginning(node, sel) {
  var range = rangy.createRange();
  range.setStart(node, 0);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

/**
 * Moves the caret to the ending of the given node.
 */
caret.moveToEnding = function moveToEnding(node, sel) {
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
};
