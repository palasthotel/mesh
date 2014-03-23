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

  // if nothing happens for this amout of milliseconds, clean up the code
  // (if enabled)
  cleanupDelay : 10000,

  // delay after which the status bar will be updated
  statusDelay : 1000,

  defaultView : 'contenteditable'
};
