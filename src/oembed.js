if (typeof $ === 'undefined')
  throw new Error('jQuery undefined')

var oembed = {};

oembed.providers = [];

oembed.providers.push({
  scheme : 'http://www.flickr.com/photos/*',
  endpoint : 'http://www.flickr.com/services/oembed/'
});

oembed.isEmbeddable = function isEmbeddable(url) {
  var i, provider, regex;
  for (i = 0; i < providers.length; i++) {
    provider = providers[i];
    var scheme = provider.scheme;
    regex = new RegExp()
  }
};

oembed.request = function request(url, callback) {
  if (!oembed.isEmbeddable(url))
    return callback(new Error('not embeddable'));

  $.ajax(url, {

  }).done(function(data, textStatus, jqXHR) {
    callback(null, data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    callback(errorThrown);
  });
};

oembed.discover = function discover(url, callback) {
  // does nothing at the moment
};
