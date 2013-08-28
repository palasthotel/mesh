if (typeof youtube === 'undefined')
  var youtube = {};

function jsonYoutubeApi(result) {
  jsonFlickrApi.callback(null, result);
}

jsonYoutubeApi.callback = function() {
};

(function($, flickr) {
  var apiKey = 'AIzaSyCKeAafm4ghAci4VWHqwUZbKQP9d-pN0Fs';

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
