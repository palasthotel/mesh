import ed = require('./editor');
import dom = require('./dom/index');
import dnd = require('./dom/dnd');
import util = require('./util');
import config = require('./config');

var conf: config.Configuration = util.extend(config.DEFAULT, {

});

/**
 * When the DOM is ready, 
 */
dom.ready(() => {
  var elem = document.getElementById('mesh-content');
  var editor = new ed.Editor(elem, conf);

  console.log('configuration', conf);

  var draggable = document.querySelectorAll('li');
  util.forEach<HTMLElement>(draggable, (el) => {
    dnd.draggable(el, {});
  });
});
