var apiKey = '43569ea83198fcb014f0d1b9f2600e72';
var secret = '4ff2d8088fb45677';

var endpoint = 'https://secure.flickr.com/services/rest';
var method = '?method=flickr.photos.search';
var api = '&api_key=' + apiKey;
var format = '&format=json';

var oembed = require('../oembed.js');
var flickr = exports;

/**
 * Searches Flickr.
 */
flickr.search = function(query, options, callback) {
  options = options || {};
  jsonFlickrApi.callback = callback; // set the callback globally

  var text = '&text=' + query;
  var page = '&page=' + (options.page || 1);
  var perPage = '&per_page=' + (options.perPage || 10);
  var sort = '&sort=' + (options.sort || 'relevance');
  var url = endpoint + method + api + format + text + page + perPage + sort;

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

flickr.oembed = function(item, options, callback) {
  var url = 'http://www.flickr.com/photos/' + item.owner + '/' + item.id + '/';

  var options = {
    format : 'json',
    maxwidth : 500,
    maxheight : 300
  };

  oembed.request(url, options, callback);
};

flickr.embedCode = function(data) {
  return [ '<div class="mesh-block"><div class="mesh-handle" ',
      'unselectable="on" contenteditable="false">',
      '</div><p><img alt="', data.title, '" title="',
      data.title, '" src="', data.url, '" ', '/></p></div>' ].join('');
};