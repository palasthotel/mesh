import ed = require('./editor');
import dom = require('./dom');
import util = require('./util');
import config = require('./config');

var conf = util.extend(config.DEFAULT, {

});

/**
 * When the DOM is ready, 
 */
dom.ready(() => {
  var elem = document.getElementById('mesh-content');
  var editor = new ed.Editor(elem, conf);

  console.log('configuration', conf);
});
