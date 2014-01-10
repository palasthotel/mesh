import ed = require('./editor');
import dom = require('./dom');
import util = require('./util');
import config = require('./config');
import plugin = require('./plugins/plugin');

export function init(conf: any, plugins: Array<plugin.Plugin>,
  cb: (err: Error, editor: ed.Editor) => void) {
  var thisConf = util.extend(config.DEFAULT, config);

  dom.ready(() => {
    var elem = document.getElementById('mesh-content');
    var editor = new ed.Editor(elem, plugins, thisConf);

    var status = document.getElementById('mesh-status');
    var delayedWordCountID: number;
    editor.getDocument().addListener('change', () => {
      if (typeof delayedWordCountID !== 'undefined')
        clearTimeout(delayedWordCountID);

      delayedWordCountID = setTimeout(() => {
        // word count
        status.innerHTML = editor.getContent()
          .replace(/<\/?(span|i|b|u|em|strong)>/g, '').replace(/<.+?>/g, ' ')
          .replace(/\s+/g, ' ').trim().split(/\s+/).length + ' words';
      }, thisConf.statusDelay);
    });

    // callback with editor instance
    cb(null, editor);
  });
}
