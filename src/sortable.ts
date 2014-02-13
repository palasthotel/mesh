/// <reference path="jquery.d.ts" />
/// <reference path="jqueryui.d.ts" />

import dataStore = require('./dataStore');
import dom = require('./dom');
import model = require('./model');
import util = require('./util');

export function makeSortable(doc: model.Document, options: any): void {
  var handleClass = options.handleClass;

  var placeholder = dom.createElement('div', 'placeholder');

  $(doc.elem).sortable({
    placeholder: 'placeholder', // css class .placeholder
    axis: 'y',
    receive: (e, ui) => {
      doc.emit('addblock');
      doc.emit('change');
    },
    stop: (e) => {
      doc.emit('change');
    }
  });
}
