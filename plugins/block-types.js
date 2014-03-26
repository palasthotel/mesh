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


function UnorderedList() {
  plugin.BlockType.call(this, 'ul', 'unordered-list', 'Unordered List');
}

oo.extend(UnorderedList, plugin.BlockType);


function OrderedList() {
  plugin.BlockType.call(this, 'ol', 'sorted-list', 'Unsorted List');
}

oo.extend(OrderedList, plugin.BlockType);

blockTypes.push(new OrderedList());
blockTypes.push(new UnorderedList());
blockTypes.push(new Quote());

// This will be used as a fallback
blockTypes.push(new Paragraph());
