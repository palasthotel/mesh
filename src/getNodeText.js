function getNodeText(node) {
  if (node.nodeType === 3) {
    return node.data;
  }

  var txt = '';

  if (node = node.firstChild)
    do {
      txt += getNodeText(node) + ' ';
    } while (node = node.nextSibling);

  return txt;
}
