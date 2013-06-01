var draggableBorderWidth = 10;

var dragSrc = null;

/**
 * Sets the attribute "unselectable" for the `node`.
 * 
 * @param {DOMNode} node
 * @param {Boolean} selectable
 * 
 */
function setSelectable(node, selectable) {
  if (node.nodeType == 1) {
    node.setAttribute('unselectable', selectable ? 'off' : 'on');
  }

  var child = node.firstChild;
  while (child) {
    setSelectable(child, selectable);
    child = child.nextSibling;
  }
}

function isInUpperHalf(e) {
  var y = e.offsetY || e.layerY - e.target.offsetTop;
  return y < e.target.clientHeight >> 1;
}

function makeEditable(node) {
  node.bind('mousemove', function(e) {
    var x = e.offsetX || e.layerX - e.target.offsetLeft;

    if (x <= draggableBorderWidth) {
      $(this).css('cursor', 'move');
      this.draggable = true;
      setSelectable(node[0], false);
    } else {
      $(this).css('cursor', 'text');
      this.draggable = false;
      setSelectable(node[0], false);
    }
  });
  node.bind('dragstart', function(e) {
    dragSrc = this;
    this.contentEditable = false;
  });

  node.bind('dragover', function(e) {
    e.preventDefault();
    $('#content > hr.insert-here').remove();
    if (isInUpperHalf(e))
      $(this).before('<hr class="insert-here" />');
    else
      $(this).after('<hr class="insert-here" />');
  });

  node.bind('dragend', function(e) {
    $('#content > hr.insert-here').remove();
  });

  node.bind('drop', function(e) {
    if (!dragSrc)
      return;

    if (isInUpperHalf(e))
      $(dragSrc).insertBefore(this);
    else
      $(dragSrc).insertAfter(this);
    dragSrc.contentEditable = true;
  });
}

$(document).ready(
    function() {
      var selectedElement = null;
      $(document).bind(
          'mouseup keyup',
          function(e) {
            if (selectedElement)
              $(selectedElement).removeClass('focus');

            var selection = window.getSelection();
            if (!selection || !selection.focusNode)
              return;

            selectedElement = window.getSelection().focusNode.parentNode;
            while (selectedElement.parentNode
                && selectedElement.parentNode.contentEditable != 'true') {
              selectedElement = selectedElement.parentNode;
            }
            $(selectedElement).addClass('focus');
          });

      $('#content > *').each(function() {
        makeEditable($(this));
      });
    });
