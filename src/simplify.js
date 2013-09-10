var serializer = new XMLSerializer();

function simplify($node) {
  var fragment = document.createDocumentFragment();

  var node = $node[0];
  var children = node.children;
  var i, cs, child, next, clss, html;
  for (i = 0; i < children.length; i++) {
    cs = children[i];
    child = cs.children[1];
    if (!child)
      continue;
    clss = child.className;
    html = child.innerHTML.replace(/&nbsp;$/g, '');

    next = child.nextSibling;
    if (next && next.className === clss)
      html += '<br />' + next.innerHTML;

    switch (clss) {
    case "p":
      var p = document.createElement("p");
      p.innerHTML = html;
      fragment.appendChild(p);
      break;
    case "blockquote":
      var blockquote = document.createElement("blockquote");
      blockquote.innerHTML = html;
      fragment.appendChild(blockquote);
      break;
    case "codeblock":
      var pre = document.createElement("pre");
      var code = document.createElement("code");
      code.innerHTML = html;
      pre.appendChild(code);
      fragment.appendChild(pre);
      break;
    case "figure":
      var fig = document.createElement("figure");
      fig.innerHTML = html;
      fragment.appendChild(fig);
      break;
    break;
  case "controls":
  case "handle":
    break;
  default:
    throw new Error("unknown class: " + clss);
  }

  fragment.appendChild(document.createTextNode("\n"));
}

var div = document.createElement("div");
div.appendChild(fragment);

return div.innerHTML.replace(/<br>/g, '<br />');
}
