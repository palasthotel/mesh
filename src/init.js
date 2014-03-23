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
 * @param {Object} conf - configuration object
 * @param {InitCallback} cb - initialization callback
 * 
 * @since 0.0.1
 */
module.exports = function init(textarea, conf, cb) {
  // extend default configuration with given conf
  var thisConf = util.extend(config.DEFAULT, conf);

  // when the dom is ready, set up the editor
  $(document).ready(function() {
    try {
      var ed = new editor.Editor(textarea, thisConf);

      var status = document.getElementById(thisConf.statusID);
      ed.addListener('change', function() {
        status.innerHTML = ed.elem.textContent.split(/\s+/).length + ' words';
      });

      // return editor instance
      cb(null, ed);
    } catch (err) {
      cb(err);
    }
  });
};