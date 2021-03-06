/**
 * Configuration related.
 * 
 * @module config
 */

/**
 * Default configuration.
 * 
 * DEFAULT = { undoSize : 50, undoDelay : 700, statusDelay : 1000, defaultView :
 * 'contenteditable' }
 * 
 * @type {Object}
 */
exports.DEFAULT = {
  // number of different states that can be saved in the undo history stack
  undoSize : 50,

  // if nothing happens for this amount of milliseconds, save the current state
  // to the undo history stack
  undoDelay : 800,

  // delay after which the status bar will be updated
  statusDelay : 1000,

  // either 'contenteditable' or 'textarea'
  defaultView : 'contenteditable',

  // make textarea always visible
  textareaAlwaysVisible : false,

  // enables the attribute editor
  enableBlockAttrEditor : true,

  // enables the block code editor
  enableBlockCodeEditor : true,

  // enables spell checking
  enableSpellChecking : true
};
