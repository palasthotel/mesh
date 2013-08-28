(function(window) {

  var mesh = {};

  /**
   * Initial setup.
   */
  $(document).ready(function() {
    var $editor = $('#mesh-content');
    var $tools = $('#mesh-tools');
    var $picker = $('#mesh-picker');
    var $source = $('#mesh-source > pre');
    var $results = $('#mesh-results');
    var $searchQuery = $('#mesh-search-query');
    var $searchSubmit = $('#mesh-search-submit');

    initTools($tools, $editor);
    initEditor($editor);
    initSourceView($source, $editor);
    initSearch($searchQuery, $searchSubmit, $results);
  });

  var conf = {
    tools : [ 'bold', 'italic', 'link' ],
    controls : {
      draggableBorderWidth : 10
    }
  };

  /**
   * Sets the attribute 'unselectable' for the `node`.
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
      $(this).bind('click', function(e) {
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
      });
    });
  }

  function getSelectedElement() {
    var selectedElement = window.getSelection().focusNode.parentNode;
    while (selectedElement.parentNode
        && selectedElement.parentNode.contentEditable != 'true') {
      selectedElement = selectedElement.parentNode;
    }
    return selectedElement;
  }

  function draggableResults() {
    var $results = $('#mesh-results .block');
    $results.each(function() {
      $(this).draggable({
        connectToSortable : '#mesh-content',
        helper : 'clone',
        revert : 'invalid'
      });
    });
  }

  function initEditor($editor) {
    if (!$editor)
      return;

    // make contenteditable and fix <br> behavior in firefox
    $editor.attr('contenteditable', true);
    document.execCommand('insertBrOnReturn', true);

    var selectedElement = null;

    function refreshRemove() {
      $editor.find('.block').each(function() {
        var block = $(this); // single block
        block.find('.remove').bind('click', function() {
          // fade out and then remove this node from dom
          block.fadeOut(function() {
            $(this).remove();
          });
        });
      });
    }
    refreshRemove();

    // selection handler
    function onSelect(e) {
      if (selectedElement)
        $(selectedElement).removeClass('focus');

      var selection = window.getSelection();
      if (!selection || !selection.focusNode)
        return;

      // walk up the DOM until we get div#mesh-content
      selectedElement = getSelectedElement();
      // focus that element
      $(selectedElement).addClass('focus');
    }

    $(document).bind('mouseup keyup', onSelect);

    $editor.sortable({
      placeholder : 'placeholder', // css class .placeholder
      axis : 'y',
      receive : function(e, ui) {
        refreshRemove();
      }
    });

    draggableResults();

    var $results = $('#mesh-results .block');
    $results.disableSelection();

    function keyDown(e) {
      console.log(e.keyCode);
      switch (e.keyCode) {
      case 8: // backspace
        keySeq.push(8);
        break;
      case 13: // return
        keySeq.push(13);
        if (keySeq.length === 2 && keySeq[0] === 13) {
          e.preventDefault();
          var sel = getSelectedElement();
          $(sel).after(
              '<div class="block"><div class="handle"'
                  + ' unselectable="on" contenteditable="false"></div>'
                  + '<div class="paragraph">&nbsp;</div><div '
                  + 'class="controls" unselectable="on" '
                  + 'contenteditable="false"><img class="remove" '
                  + 'alt="remove" src="res/remove.png" /></div></div>');
          var next = $(sel.nextSibling).find('.paragraph')[0];
          var range = document.createRange();
          range.setStart(next, 0);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
        break;
      case 46: // delete
        keySeq.push(46);
        break;
      default:
        keySeq = [];
      }
    }

    var keySeq = [];
    $('#mesh-content').bind('keydown', keyDown);
  }

  function initSourceView($source, $editor) {
    function listener() {
      $source.html(escapeHTML(simplify($editor)));
    }

    $editor.bind('input', listener);
    $editor.bind('DOMNodeInserted', listener);
    $editor.bind('DOMNodeRemoved', listener);
    $editor.bind('DOMCharacterDataModified', listener);

    listener();
  }

  function initSearch($searchQuery, $searchSubmit, $results) {
    var timeout = null;
    $searchSubmit.bind('click', function(e) {
      e.preventDefault();
      $results.html('');
      search($searchQuery.val(), 1);
    });

    function search(query, page, loadMore) {
      flickr.search(query, {
        page : page
      }, function(err, result) {
        if (err)
          return; // TODO show warning

        try {
          var todo = result.photos.photo.length;
          $(result.photos.photo).each(function() {
            flickr.oembed(this, {}, function(err, data) {
              console.log(loadMore);
              if (loadMore) {
                loadMore.remove();
                loadMore = null;
              }

              if (err)
                throw err;

              $results.append(flickr.embedCode(data));

              if (--todo === 0) {
                draggableResults();

                $results.append('<div class="load-more">Load more</div>');
                var btn = $('#mesh-results .load-more');
                btn.bind('click', function() {
                  btn.html('...');
                  btn.unbind();
                  search(query, page + 1, btn);
                });
              }
            });
          });
        } catch (ex) {
          // TODO show warning: unexpected format
          // exception
        } finally {
        }
      });
    }
  }

  window.mesh = mesh;

})(this);
