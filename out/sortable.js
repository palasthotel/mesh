/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />
var dom = require('./dom');

function makeSortable(doc, options) {
    var handleClass = options.handleClass;

    var placeholder = dom.createElement('div', 'placeholder');

    $(doc.elem).sortable({
        placeholder: 'placeholder',
        axis: 'y',
        receive: function (e, ui) {
            doc.emit('addblock');
            doc.emit('change');
        },
        stop: function (e) {
            doc.emit('change');
        }
    });
}
exports.makeSortable = makeSortable;
