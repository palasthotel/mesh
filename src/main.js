/**
 * Main module.
 * 
 * @module main
 * @author Paul Vorbach
 */

var editor = require('./editor.js');
var dom = require('./dom.js');
var dnd = require('./dnd.js');
var util = require('./util.js');
var config = require('./config.js');

/**
 * Called when the editor is initialized.
 * 
 * @callback InitCallback
 * @param {Error} error
 * @param {Editor} editor
 * 
 */

/**
 * Initialize the editor.
 * 
 * @param {Object} conf - configuration object
 * @param {InitCallback} cb - initialization callback
 * 
 * @since 0.0.1
 */
module.exports = function init(conf, cb) {
  var thisConf = util.extend(config.DEFAULT, conf);

  dom.ready(function() {
    var elem = document.getElementById(thisConf.contentID);
    var ed = new editor.Editor(elem, thisConf);
    
    var status = document.getElementById(thisConf.statusID);
    
  });
};
