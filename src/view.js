/**
 * @module view
 */

var events = require('events');
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

oo.extend(EditorView, events.EventEmitter);

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

  // create and set document model
  this.setModel(new model.DocumentModel(content, escaped));

  // initialize with empty selection model
  this.setSelectionModel(new model.BlockSelectionModel(null));

  this.elem = dom.createElement('div');

  // set contenteditable
  this.elem.contentEditable = true;

  $(this.elem).addClass('mesh-content');

  this.updateView();
  var view = this;

  $(this.elem).sortable({
    axis : 'y',
    handle : '.mesh-handle',
    placeholder : 'mesh-placeholder',
    stop : function stopSort() {
      // remove selection when the document is sorted
      rangy.getSelection().removeAllRanges();
      view.updateModel();
    }
  });

  this.getModel().append(new model.BlockModel(dom.createElement('p')));
  this.updateView();

  // Update the selection model on click and keyup
  $(this.elem).bind('click keyup', function selectionChange(e) {
    if (e.type === 'keyup' && e.keyCode < 33 && e.keyCode > 40) {
      // when the pressed key was not a selection key, return
      // selection keys are the arrow keys, home and end
      return;
    }

    // get the selection
    var selection = rangy.getSelection();

    // only single selection is supported, so this is ok
    var range = selection.getRangeAt(0);

    var m = view.getModel();
    var size = m.length();

    // selected block
    var selected = null;

    // highlight the selected block
    for (var i = 0; i < size; i++) {
      var blockElem = m.get(i).getElement();

      $(blockElem.parentNode).removeClass('focus');

      if (dom.containsNode(blockElem, range.startContainer)) {
        // remember first block
        selected = blockElem;
        $(blockElem.parentNode).addClass('focus');
      }
    }

    view.setSelectionModel(new model.BlockSelectionModel(selected));
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

/**
 * This method gets called whenever the model changed and the changes shall be
 * applied to the view accordingly.
 */
ContentEditableView.prototype.updateView = function() {
  var m = this.getModel();
  var docFrgmt = document.createDocumentFragment();

  $(this.getElement()).find('.mesh-block').remove();

  // build the view
  var size = m.length();
  for (var i = 0; i < size; i++) {
    var blockView = new BlockView(m.get(i), this);

    docFrgmt.appendChild(blockView.getElement());
  }

  this.getElement().appendChild(docFrgmt);
};

/**
 * This method gets called whenever the view changed and the changes shall be
 * applied to the model accordingly.
 */
ContentEditableView.prototype.updateModel = function() {
  var docModel = new model.DocumentModel();
  $(this.getElement()).find('.mesh-block').each(function() {
    docModel.append(this.children[0]);
  });

  this.emit('change');
};

ContentEditableView.prototype.setSelectionModel = function(selectionModel) {
  this.selectionModel = selectionModel;

  this.emit('selection');
};

ContentEditableView.prototype.getSelectionModel = function() {
  return this.selectionModel;
};

// BLOCK VIEW

exports.BlockView = BlockView;

function BlockView(blockModel, documentView) {
  var wrapper = dom.createElement('div', 'mesh-block');

  // content
  var content = blockModel.getElement();

  // drag handle
  var handle = dom.createElement('div', 'mesh-handle');
  handle.contentEditable = false;
  $(handle).disableSelection();

  // block controls
  var controls = dom.createElement('div', 'mesh-controls');
  controls.contentEditable = false;
  $(controls).disableSelection();

  // remove button
  var remove = dom.createElement('div', 'mesh-remove');
  $(remove).click(function onRemoveBlock() {
    $(wrapper).fadeOut(400, function() {
      $(wrapper).remove();

      documentView.updateModel();

      rangy.getSelection().removeAllRanges();

      if (documentView.getModel().length() == 0) {
        // if there is no other content, add an empty paragraph
        var p = document.createElement('p');
        documentView.getModel().append(new model.BlockModel(p));
        documentView.updateView();
      }
    });
  });

  // attribute editor button
  var attrs = dom.createElement('div', 'mesh-attrs');
  $(attrs).click(function onEditBlockAttributes() {
    // TODO show attribute editor
  });

  controls.appendChild(remove);
  controls.appendChild(attrs);

  wrapper.appendChild(content);
  wrapper.appendChild(handle);
  wrapper.appendChild(controls);

  this.elem = wrapper;
}

BlockView.prototype.getElement = function() {
  return this.elem;
};
