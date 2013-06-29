var oembed = require('../src/oembed.js');

var url =
    'http://www.flickr.com/photos/'
        + '38181364@N03/9150363825/in/explore-2013-06-27';

console.log(oembed);

var provider = oembed.getProviderFor(url);

console.log(provider);

oembed.request(url, function(err, data) {
  if (err)
    throw err;

  console.log(data);
});
