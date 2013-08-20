if (typeof flickr === 'undefined')
  var flickr = {};

function jsonFlickrApi(result) {
  jsonFlickrApi.callback(null, result);
}

jsonFlickrApi.callback = function() {
};

(function($, flickr) {
  var apiKey = '43569ea83198fcb014f0d1b9f2600e72';
  var secret = '4ff2d8088fb45677';

  var endpoint = 'https://secure.flickr.com/services/rest';
  var method = '?method=flickr.photos.search';
  var api = '&api_key=' + apiKey;
  var format = '&format=json';

  flickr.search = function(query, options, callback) {
    options = options || {};
    jsonFlickrApi.callback = callback; // set the callback globally

    var text = '&text=' + query;
    var perPage = '&per_page=' + (options.perPage || 10);
    var url = endpoint + method + api + format + text + perPage;

    $.ajax({
      url : url,
      type : 'GET',
      dataType : 'jsonp',
      success : function(data, textStatus, jqXHR) {
        callback(null, data);
      },
      error : function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown);
      }
    });
  };
})(jQuery, flickr);
