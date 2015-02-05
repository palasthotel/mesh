var config = require('./config.js');
var editor = require('./editor.js');
var util = require('./util.js');

/**
 * Called when the editor is initialized.
 *
 * @callback InitCallback
 * @param {Error} error
 * @param {Editor} editor
 */

/**
 * Initialize the editor.
 *
 * @param {HTMLElement} textarea - `<textarea>`
 * @param {HTMLElement} toolbar - toolbar element
 * @param {HTMLElement} statusbar - statusbar element
 * @param {Array<ControlPlugin>} plugins - array of enabled plugins
 * @param {Object} conf - custom configuration object
 * @param {InitCallback} cb - initialization callback
 *
 * @since 0.0.1
 */
module.exports = function init(textarea, toolbar, statusbar, plugins, conf, cb) {
  // extend default configuration with given conf
  var thisConf = util.extend(config.DEFAULT, conf);

  // when the dom is ready, set up the editor
  $(document).ready(function() {
    try {
      var ed = new editor.Editor(textarea, toolbar, statusbar, plugins, thisConf);

      // return editor instance
      cb(null, ed);
    } catch (err) {
      cb(err);
    }
  });
};
