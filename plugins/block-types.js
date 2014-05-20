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
  plugin.BlockType.call(this, 'ol', 'ordered-list', 'Ordered List');
}

oo.extend(OrderedList, plugin.BlockType);


function H2() {
  plugin.BlockType.call(this, 'h2', 'heading-2', 'Heading');
}

oo.extend(H2, plugin.BlockType);

function H3() {
  plugin.BlockType.call(this, 'h3', 'heading-3', 'Sub-Heading');
}

oo.extend(H3, plugin.BlockType);

blockTypes.push(new OrderedList());
blockTypes.push(new UnorderedList());
blockTypes.push(new Quote());
blockTypes.push(new H3());
blockTypes.push(new H2());

// This will be used as a fallback
blockTypes.push(new Paragraph());
