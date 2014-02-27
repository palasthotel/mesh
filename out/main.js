var ed = require('./editor');
var dom = require('./dom');
var util = require('./util');
var config = require('./config');

function init(conf, plugins, cb) {
    var thisConf = util.extend(config.DEFAULT, config);

    dom.ready(function () {
        var content = document.getElementById('mesh-content');
        var toolbar = document.getElementById('mesh-toolbar');
        var status = document.getElementById('mesh-status');

        var editor = new ed.Editor(content, toolbar, plugins, thisConf);

        var delayedWordCountID;
        editor.getDocument().addListener('change', function () {
            if (typeof delayedWordCountID !== 'undefined')
                clearTimeout(delayedWordCountID);

            delayedWordCountID = setTimeout(function () {
                // word count
                status.innerHTML = editor.getContent().replace(/<\/?(span|i|b|u|em|strong)>/g, '').replace(/<.+?>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length + ' words';
            }, thisConf.statusDelay);
        });

        // callback with editor instance
        cb(null, editor);
    });
}
exports.init = init;
