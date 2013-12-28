var ed = require('./editor');
var util = require('./util');
var config = require('./config');

var conf = util.extend(config.DEFAULT, {});

util.domReady(function () {
    var elem = document.getElementById('mesh-content');
    var editor = new ed.Editor(elem, conf);

    console.log('configuration', conf);
});
