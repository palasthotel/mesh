import ed = require('./editor');
import dom = require('./dom');
import util = require('./util');
import config = require('./config');
import plugin = require('./plugins/plugin');

export function init(conf: any, plugins: Array<plugin.Plugin>,
  cb: (err: Error, editor: ed.Editor) => void) {
  var thisConf = util.extend(config.DEFAULT, config);

  dom.ready(() => {
    var content = document.getElementById('mesh-content');
    var toolbar = document.getElementById('mesh-toolbar');
    var status = document.getElementById('mesh-status');

    var editor = new ed.Editor(content, toolbar, plugins, thisConf);

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
