var mesh = require('../src/index.js');

var oo = mesh.oo;
var plugin = mesh.plugin;

var blockTypes = module.exports = [];

function Paragraph() {
  plugin.BlockType.call(this, 'p', 'paragraph', 'Normal');
}

oo.extend(Paragraph, plugin.BlockType);

function Quote() {
  plugin.BlockType.call(this, 'blockquote', 'quote', 'Quote');
}

oo.extend(Quote, plugin.BlockType);

blockTypes.push(new Quote());
blockTypes.push(new Paragraph());
