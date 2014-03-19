/**
 * @module view
 */

var model = require('./model.js');
var dom = require('./dom.js');
var oo = require('./oo.js');
var util = require('./util.js');

exports.EditorView = EditorView;

/**
 * View for an `Editor`.
 * 
 * Should not be instantiated directly.
 * 
 * @constructor
 * @abstract
 */
function EditorView() {
  this.model = null;
}

EditorView.prototype.setModel = function(model) {
  this.model = model;
};

EditorView.prototype.getModel = function() {
  return this.model;
};

exports.TextareaView = TextareaView;

/**
 * Creates a view out of a `<textarea>`.
 * 
 * @param {HTMLElement} textarea - textarea element
 * 
 * @constructor
 * @extends EditorView
 */
function TextareaView(textarea) {
  EditorView.call(this);

  this.setModel(new model.DocumentModel($(textarea).val(), false));
}

// inheritance
oo.extend(TextareaView, EditorView);

// ContentEditableView

exports.ContentEditableView = ContentEditableView;

/**
 * Creates a new view for a `DocumentModel` using a `DIV` with
 * `contenteditable=true`.
 * 
 * @param {String} content - content string
 * @param {Object} conf - configuration object
 * @param {Boolean} [escaped] - determines whether the given content string is
 *                escaped already
 * 
 * @constructor
 * @extends EditorView
 */
function ContentEditableView(content, conf, escaped) {
  EditorView.call(this);

  this.conf = conf;

  this.setModel(new model.DocumentModel(content, escaped));

  this.elem = dom.createElement('div');

  // set contenteditable
  $(this.elem).attr('contenteditable', true);
  $(this.elem).addClass('mesh-content');

  this.updateView();

  var blockHandle = dom.createElement('div', 'mesh-block-handle');
  blockHandle.contentEditable = false;
  $(blockHandle).css({
    'position' : 'absolute',
    'left' : '-12px'
  });

  $(blockHandle).bind('mousedown', function() {

  });

  this.elem.appendChild(blockHandle);

  var view = this;

  $(this.getElement()).bind('mouseup keyup', function(e) {
    if (e.type === 'keyup' && e.keyCode < 33 && e.keyCode > 40) {
      // when the pressed key was not a selection key, return
      // selection keys are the arrow keys, home and end
      return;
    }

    // get the selection
    var selection = rangy.getSelection();

    // only single selection is supported, so this is ok
    var range = selection.getRangeAt(0);

    console.log(selection);
    console.log(range);

    var m = view.getModel();
    var size = m.length();

    // first and last selected block
    var first = null, last = null;

    // highlight all selected blocks
    for (var i = 0; i < size; i++) {
      var blockElem = m.get(i).getElement();

      if (dom.containsNode(blockElem, range.startContainer)) {
        // remember first block
        first = blockElem;
      }

      if (first !== null && last === null) {
        $(blockElem).addClass('selected');
      } else {
        $(blockElem).removeClass('selected');
      }

      // if we didn't find the first block yet, skip to next block
      if (first === null) {
        continue;
      }

      if (dom.containsNode(blockElem, range.endContainer)) {
        // remember last block
        last = blockElem;
      }
    }

    // set size and position of the block handle
    if (first && last) {
      var handleTop = first.offsetTop;
      var handleHeight = last.offsetTop + last.offsetHeight - first.offsetTop;
      $(blockHandle).animate({
        'top' : handleTop,
        'height' : handleHeight
      });
    }
  });
}

// inheritance
oo.extend(ContentEditableView, EditorView);

/**
 * @returns {HTMLElement}
 */
ContentEditableView.prototype.getElement = function() {
  return this.elem;
};

ContentEditableView.prototype.updateView = function() {
  var m = this.getModel();
  var docFrgmt = document.createDocumentFragment();

  var size = m.length();
  for (var i = 0; i < size; i++) {
    docFrgmt.appendChild(m.get(i).getElement());
  }

  this.getElement().appendChild(docFrgmt);
};
