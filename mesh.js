(function mesh(window) {

  var mesh = {};

  var conf = {
    tools : [ 'bold', 'italic', 'link' ],
    controls : {
      draggableBorderWidth : 10
    }
  };

  var dragSrc = null;

  /**
   * Sets the attribute "unselectable" for the `node`.
   * 
   * @param {DOMNode}
   *                node
   * @param {Boolean}
   *                selectable
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

  /**
   * Determine if the mouse is in the upper half of the underlying element.
   * 
   * @param {JQueryMouseEvent}
   *                e
   * @returns {Boolean}
   */
  function isInUpperHalf(e) {
    var y = e.offsetY || e.layerY - e.target.offsetTop;
    return y < e.target.clientHeight >> 1;
  }

  function selectElementContents(el) {
    if (window.getSelection && document.createRange) {
      var sel = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.select();
    }
  }

  /**
   * Make the node editable and draggable.
   * 
   * @param {DOMNode}
   *                node
   */
  function makeEditable() {
    var node = this;
    var $node = $(this);

    $node.bind('mousemove', function(e) {
      var x = e.offsetX || e.layerX - e.target.offsetLeft;

      if (x <= conf.controls.draggableBorderWidth) {
        $(this).css('cursor', 'move');
        this.draggable = true;
        setSelectable($node[0], false);
      } else {
        $(this).css('cursor', 'inherit');
        this.draggable = false;
        setSelectable($node[0], true);
      }
    });

    $node.bind('dragstart', function(e) {
      dragSrc = this;

      // selectElementContents(this);

      if (e.originalEvent.dataTransfer)
        e.originalEvent.dataTransfer.effectAllowed = 'move';

      e.originalEvent.dataTransfer.setData('text/html', null);

      this.contentEditable = 'false';
    });

    $node.bind('dragover', function(e) {
      $('#mesh-content > div.insert-here').remove();

      if (isInUpperHalf(e))
        $(this).before('<div class="insert-here"></div>');
      else
        $(this).after('<div class="insert-here"></div>');

      $('#mesh-content > div.insert-here').bind('dragover', function(e) {
        e.preventDefault();
        return false;
      });

      $('#mesh-content > div.insert-here').bind('drop', function(e) {
        if (!dragSrc)
          return;

        $(this).replaceWith(dragSrc);
        dragSrc.contentEditable = 'inherit';
      });

      e.preventDefault();
      return false;
    });

    $node.bind('dragend', function(e) {
      $('#mesh-content > div.insert-here').remove();
    });

    $node.bind('drop', function(e) {
      if (!dragSrc || dragSrc === this)
        return;

      if (isInUpperHalf(e))
        $(dragSrc).insertBefore(this);
      else
        $(dragSrc).insertAfter(this);
      dragSrc.contentEditable = 'inherit';
    });
  }

  function sanitizeContent(rootNode) {
    // TODO sanitize the content div
  }

  function initTools(toolsDiv, editorDiv) {
    conf.tools = conf.tools || [];

    var button, tool;
    for ( var i = 0; i < conf.tools.length; i++) {
      tool = conf.tools[i];
      switch (tool) {
      case 'bold':
        button = '<button data-tag="bold"><strong>B</strong></button>';
        break;
      case 'italic':
        button = '<button data-tag="italic"><em>I</em></button>';
        break;
      case 'link':
        button =
            '<button data-tag="createLink"><a style="color: blue; text-decoration: underline">Link</a></button>';
        break;
      default:
        return; // skip adding a button, if the tool is unknown
      }

      // add the button to toolsDiv
      toolsDiv.append(button);
    }

    // select all of our buttons
    $('button[data-tag]').each(function() {
      this.onclick = function(e) {
        var tag = this.getAttribute('data-tag');
        switch (tag) {
        case 'createLink':
          var url = prompt('Please specify the URL');
          if (url)
            document.execCommand(tag, false, url);
          break;
        // case 'insertImage':
        // break;
        // case 'heading':
        // break;
        default:
          // make bold, italic etc.
          document.execCommand(tag, false, this.getAttribute('data-value'));
        }

        // sanitize content
        sanitizeContent();

        // prevent default action (usually submitting the form)
        e.preventDefault();
      };
    });
  }

  function initEditor($editor) {
    if (!$editor)
      return;

    $editor.attr('contenteditable', true);

    var selectedElement = null;
    function onSelect(e) {
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
    }

    $(document).bind('mouseup keyup', onSelect);

    $('#mesh-content > *').each(makeEditable);
  }

  /**
   * Initial setup.
   */
  $(document).ready(function() {
    var $editor = $('#mesh-content');
    var $tools = $('#mesh-tools');

    initTools($tools, $editor);
    initEditor($editor);
  });

  window.mesh = mesh;

})(this);
