(function(window) {
  'use strict';

  var mesh = {};

  /**
   * Initial setup.
   */
  $(document).ready(function() {
    var $editor = $('#mesh-content');
    var $tools = $('#mesh-tools');
    var $attributes = $('#mesh-attributes');
    var $picker = $('#mesh-picker');
    var $source = $('#mesh-source > pre');
    var $results = $('#mesh-results');
    var $searchQuery = $('#mesh-search-query');
    var $searchSubmit = $('#mesh-search-submit');

    var attributes = initAttributes($attributes);
    var editor = initEditor($editor, attributes);
    initTools($tools, $editor, editor);
    initSourceView($source, editor);
    initSearch($searchQuery, $searchSubmit, $results);

    editor.emitEvent('change');
  });

  var conf =
      {
        tools : [ 'bold', 'italic', 'link', 'p', 'quote', 'ul', 'ol', 'code',
            'undo', 'redo' ],
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

  function initTools($toolsDiv, $editorDiv, editor) {
    conf.tools = conf.tools || [];

    var button, tool;
    for ( var i = 0; i < conf.tools.length; i++) {
      tool = conf.tools[i];
      switch (tool) {
      case 'bold':
        button = '<button class="bold"><i class="fa fa-bold"></i></button>';
        break;
      case 'italic':
        button = '<button class="italic"><i class="fa fa-italic"></i></button>';
        break;
      case 'link':
        button = '<button class="link"><i class="fa fa-link"></i></button>';
        break;
      case 'p':
        button = '<button class="p">¶</button>';
        break;
      case 'quote':
        button =
            '<button class="quote"><i class="fa fa-quote-left"></i></button>'
        break;
      case 'ul':
        button = '<button class="ul"><i class="fa fa-list-ul"></i></button>';
        break;
      case 'ol':
        button = '<button class="ol"><i class="fa fa-list-ol"></i></button>';
        break;
      case 'code':
        button = '<button class="code"><i class="fa fa-code"></i></button>';
        break;
      case 'undo':
        button =
            '<button class="undo" disabled="disabled"><i class="fa fa-undo"></i></button>';
        break;
      case 'redo':
        button =
            '<button class="redo" disabled="disabled"><i class="fa fa-repeat"></i></button>';
        break;
      default:
        return; // skip adding a button, if the tool is unknown
      }

      // add the button to toolsDiv
      $toolsDiv.append(button);
    }

    // select all of our buttons
    $toolsDiv.find('button[class]').each(function() {
      $(this).bind('click', function(e) {
        var tag = this.getAttribute('class');
        switch (tag) {
        // add check if state is already set
        case 'p':
          editor.activeBlock.transformType('p');
          break;
        case 'quote':
          editor.activeBlock.transformType('blockquote');
          break;
        case 'ul':
          editor.activeBlock.transformType('ul');
          break;
        case 'ol':
          editor.activeBlock.transformType('ol');
          break;
        case 'code':
          editor.activeBlock.transformType('pre');
          break;
        case 'link':
          var url = prompt('Please specify the URL');
          if (url)
            document.execCommand('createLink', false, url);
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
        // sanitizeContent();

        // prevent default action (usually submitting the form)
        e.preventDefault();
      });
    });
  }

  function getSelectedElement() {
    var selectedElement = rangy.getSelection().focusNode.parentNode;
    while (selectedElement.parentNode
        && selectedElement.parentNode.contentEditable != 'true') {
      selectedElement = selectedElement.parentNode;
    }
    return selectedElement;
  }

  function initAttributes($attributes) {
    var attributes = new Attributes($attributes[0]);

    return attributes;
  }

  function initEditor($editor, attributes) {
    // create editor
    var editor = new Editor($editor[0], attributes);

    // make editor publicly accessible
    window.editor = editor;

    // set the editors contents
    editor
        .setContent('<p>Text with <b>some</b> <i>form<b>atting</b></i><br>A <a href="/">Link</a></p><blockquote>Quote</blockquote><ul><li>element</li><li>element</li></ul><ol><li>element</li><li>element</li></ol><pre>//source code</pre>');

    var selectedElement = null;

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

    var $results = $('#mesh-results .block');
    $results.disableSelection();

    var $status = $('#mesh-status');
    editor.addEventListener('change', function updateStatusLine() {
      var wc = editor.getWordCount();
      var status = wc + ' word' + (wc === 1 ? '' : 's');
      $status.html(status);
    });

    function setButtonState(btn) {
      var s = editor.getState(btn);
      var b = $('#mesh-tools').find('.' + btn);

      if (s)
        b.addClass('active');
      else
        b.removeClass('active');
    }

    editor.addEventListener('state', function(e) {
      setButtonState('bold');
      setButtonState('italic');
      setButtonState('link');
      setButtonState('p');
      setButtonState('quote');
      setButtonState('ul');
      setButtonState('ol');
      setButtonState('code');
    });

    attributes.addEventListener('change', function() {
      editor.getActiveBlock().attributes = attributes.getAttributes();
      editor.emitEvent('change');
    });

    return editor;
  }

  function initSourceView($source, editor) {
    var $sourceView = $('#mesh-source');
    $('#mesh-source-preview').bind('click', function() {
      var xml = editor.toXML();
      $source.html(escapeXML(xml));
      $sourceView.fadeIn();
    });

    $sourceView.bind('click', function() {
      $sourceView.fadeOut();
    });
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
              if (loadMore) {
                loadMore.remove();
                loadMore = null;
              }

              if (err) {
                todo--;
                throw err;
              }

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

  function draggableResults() {
    var $results = $('#mesh-results .block');
    $results.each(function() {
      $(this).draggable({
        connectToSortable : '#mesh-content',
        helper : 'clone',
        revert : 'invalid',
        containment : $('#container')
      });
    });
  }

  window.mesh = mesh;

})(this);
