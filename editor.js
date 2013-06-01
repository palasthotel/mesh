// Configuration object. Could also be loaded through an extra script or JSON
// document.
var conf = {
  tools : [ 'bold', 'italic', 'link' ]
};

/**
 * Initialize Mesh WYSIWYG.
 * 
 * @param editorDiv
 * @param toolsDiv
 * @param [previewDiv]
 */
function init(conf, editorDiv, toolsDiv, previewDiv) {
  initTools(conf, toolsDiv, editorDiv);
  initEditor(conf, editorDiv, previewDiv);
}

function initTools(conf, toolsDiv, editorDiv) {
  conf.tools = conf.tools || [];

  conf.tools
      .forEach(function(tool) {
        var button;
        switch (tool) {
        case 'bold':
          button = '<button data-tag="bold"><strong>B</strong></button>';
          break;
        case 'italic':
          button = '<button data-tag="italic"><em>I</em></button>';
          break;
        case 'link':
          button = '<button data-tag="createLink"><a style="color: blue; text-decoration: underline">Link</a></button>';
          break;
        default:
          return; // skip adding a button, if the tool is unknown
        }
        ;

        // add the button to toolsDiv
        toolsDiv.append(button);
      });

  // select all of our buttons
  var btns = $('button[data-tag]');
  for ( var i = 0; i < btns.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function(e) {
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

        e.preventDefault(); // prevent default action (usually submitting the
                            // form)
      });
    }).call(null, btns[i]);
  }
}

function initEditor(conf, editorDiv, previewDiv) {
  if (!editorDiv)
    return;

  editorDiv.attr('contenteditable', true);
}

function getTextSelection() {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.selection && document.selection.type != 'Control') {
    return document.selection.createRange().text;
  }
  return '';
}

$(document).ready(function() {
  var editorDiv = $('#mesh-editor');
  var toolsDiv = $('#mesh-tools');
  var previewDiv = $('#mesh-preview');

  init(conf, editorDiv, toolsDiv, previewDiv);
});
