import ed = require('./editor');
import dom = require('./dom');
import util = require('./util');
import config = require('./config');

export function init(conf: any, cb: (err: Error, editor: ed.Editor) => void) {
  var thisConf = util.extend(config.DEFAULT, config);

  dom.ready(() => {
    var elem = document.getElementById('mesh-content');
    var editor = new ed.Editor(elem, thisConf);

    var status = document.getElementById('mesh-status');
    editor.getDocument().addListener('change', () => {
      // word count
      status.innerHTML = editor.getContent() .replace(/<.+?>/g, ' ')
        .replace(/\s+/g, ' ').trim().split(/\s+/).length + ' words';
    });

    // callback with editor instance
    cb(null, editor);
  });
}
