/**
 * JS client for Twitter API v1.1
 */

if (typeof twitter === 'undefined')
  var twitter = {};

function jsonTwitterApi(result) {
  jsonTwitterApi.callback(null, result);
}

jsonTwitterApi.callback = function() {
};

(function($, twitter) {
  var apiKey = '43569ea83198fcb014f0d1b9f2600e72';
  var secret = '4ff2d8088fb45677';

  var endpoint = 'https://api.twitter.com/1.1/search/tweets.json';
  var api = '&api_key=' + apiKey;
  var format = '&format=json';

  flickr.search = function(query, options, callback) {
    options = options || {};
    jsonFlickrApi.callback = callback; // set the callback globally

    var text = '&text=' + query;
    var perPage = '&per_page=' + (options.perPage || 10);
    var url = endpoint + api + format + text + perPage;

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
})(jQuery, twitter);
