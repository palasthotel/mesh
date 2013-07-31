(function(window) {

  if (typeof $ === 'undefined')
    throw new Error('jQuery undefined')

  var oembed = {};

  /**
   * Array of all oEmbed providers.
   */
  var providers = oembed.providers = [];

  oembed.providers.push({
    scheme : 'http://www.flickr.com/photos/*',
    endpoint : 'http://www.flickr.com/services/oembed/',
    callbackParameter : 'jsoncallback'
  });

  /**
   * Get the corresponding oEmbed provider for a given URL.
   * 
   * @returns a provider object, if the URL is embeddable, false otherwise
   */
  oembed.getProviderFor = function getProviderFor(url) {
    var i, provider, regex;

    // for every provider, check if the given url matches the provider's scheme.
    for (i = 0; i < providers.length; i++) {
      provider = providers[i];
      var scheme = provider.scheme;
      regex = new RegExp(scheme.replace('*', '.+'))
      if (regex.test(url))
        return provider;
    }

    return false;
  };

  /**
   * Request oEmbed information.
   * 
   * @param url
   *                the url you want to embed
   * @param requestParams
   *                an object that contains additional request parameters (such
   *                as maxwidth, maxheight)
   * @param callback
   *                a callback function(err, info)
   */
  oembed.request = function request(url, requestParams, callback) {
    var provider = oembed.getProviderFor(url);
    if (provider === false)
      return callback(new Error('not embeddable'));

    var requestUrl = provider.endpoint;
    // set the query parameters of the request url
    requestUrl += '?url=' + encodeURI(url);
    var keys = Object.keys(requestParams);
    for ( var i = 0; i < keys.length; i++) {
      var key = keys[i];
      requestUrl += '&' + key + '=' + requestParams[key];
    }
    if (typeof provider.callbackParameter !== 'undefined')
      requestUrl += '&' + provider.callbackParameter + '=?';

    function request(dataType) {
      $.ajax({
        url : requestUrl,
        type : 'GET',
        dataType : dataType,
        success : function(data, textStatus, jqXHR) {
          console.log(arguments)
          callback(null, data);
        },
        error : function(jqXHR, textStatus, errorThrown) {
          callback(errorThrown);
        }
      });
    }

    try {
      request('json');
    } catch (err) {
      request('jsonp');
    }
  };

  oembed.discover = function discover(url, callback) {
    // does nothing at the moment
    callback(new Error('not impelemented'));
  };

  window.oembed = oembed;
})(this);