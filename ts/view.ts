import config = require('./config');
import Configuration = config.Configuration;
import consts = require('./consts');
import dom = require('./dom/index');
import editor = require('./editor');
import Editor = editor.Editor;
import exceptions = require('./exceptions');
import util = require('./util');

/**
 * View of an editor.
 */
export class View {
  editor: Editor;
  config: Configuration;

  constructor(editor: Editor, config: Configuration) {
    this.editor = editor;
    this.config = config;
  }
}

/**
 * View that uses contenteditable.
 */
export class ContentEditableView extends View {
  constructor(editor: Editor, config: Configuration) {
    super(editor, config);
  }
}

/**
 * View that uses textarea.
 */
export class TextAreaView extends View {
  constructor(editor: Editor, config: Configuration) {
    super(editor, config);
  }
}
