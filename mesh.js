;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var oembed = require('./oembed.js');



},{"./oembed.js":2}],2:[function(require,module,exports){
var oembed = exports = {};

if (typeof $ === 'undefined')
  throw new Error('jQuery undefined')

var providers = require('./oembed-providers.js');

oembed.getProviderFor = function getProviderFor(url) {
  var i;
  for (i = 0; i < providers.length; i++) {
    var provider = providers[i];
    var pattern = '^' + provider.scheme.replace('*', '.+') + '$';
    var regex = new RegExp(pattern);
    var match = regex.exec(url);
    if (match) {
      return provider;
    }
  }

  return null;
};

oembed.request = function request(url, callback) {
  if (!oembed.isEmbeddable(url))
    return callback(new Error('not embeddable'));

  $.ajax(url).done(function done(data, textStatus, jqXHR) {
    callback(null, data);
  }).fail(function fail(jqXHR, textStatus, errorThrown) {
    callback(errorThrown);
  });
};

oembed.discover = function discover(url, callback) {
  // does nothing at the moment
};

},{"./oembed-providers.js":3}],3:[function(require,module,exports){
module.exports = [ {
  scheme : 'http://www.flickr.com/photos/*',
  endpoint : 'http://www.flickr.com/services/oembed/'
} ];

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJjOlxcRGV2XFxQYWxhc3Rob3RlbFxcbWVzaFxcc3JjXFxtYWluLmpzIiwiYzpcXERldlxcUGFsYXN0aG90ZWxcXG1lc2hcXHNyY1xcb2VtYmVkLmpzIiwiYzpcXERldlxcUGFsYXN0aG90ZWxcXG1lc2hcXHNyY1xcb2VtYmVkLXByb3ZpZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgb2VtYmVkID0gcmVxdWlyZSgnLi9vZW1iZWQuanMnKTtcblxuXG4iLCJ2YXIgb2VtYmVkID0gZXhwb3J0cyA9IHt9O1xuXG5pZiAodHlwZW9mICQgPT09ICd1bmRlZmluZWQnKVxuICB0aHJvdyBuZXcgRXJyb3IoJ2pRdWVyeSB1bmRlZmluZWQnKVxuXG52YXIgcHJvdmlkZXJzID0gcmVxdWlyZSgnLi9vZW1iZWQtcHJvdmlkZXJzLmpzJyk7XG5cbm9lbWJlZC5nZXRQcm92aWRlckZvciA9IGZ1bmN0aW9uIGdldFByb3ZpZGVyRm9yKHVybCkge1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IHByb3ZpZGVycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwcm92aWRlciA9IHByb3ZpZGVyc1tpXTtcbiAgICB2YXIgcGF0dGVybiA9ICdeJyArIHByb3ZpZGVyLnNjaGVtZS5yZXBsYWNlKCcqJywgJy4rJykgKyAnJCc7XG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChwYXR0ZXJuKTtcbiAgICB2YXIgbWF0Y2ggPSByZWdleC5leGVjKHVybCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXR1cm4gcHJvdmlkZXI7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5vZW1iZWQucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QodXJsLCBjYWxsYmFjaykge1xuICBpZiAoIW9lbWJlZC5pc0VtYmVkZGFibGUodXJsKSlcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdub3QgZW1iZWRkYWJsZScpKTtcblxuICAkLmFqYXgodXJsKS5kb25lKGZ1bmN0aW9uIGRvbmUoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgfSkuZmFpbChmdW5jdGlvbiBmYWlsKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgIGNhbGxiYWNrKGVycm9yVGhyb3duKTtcbiAgfSk7XG59O1xuXG5vZW1iZWQuZGlzY292ZXIgPSBmdW5jdGlvbiBkaXNjb3Zlcih1cmwsIGNhbGxiYWNrKSB7XG4gIC8vIGRvZXMgbm90aGluZyBhdCB0aGUgbW9tZW50XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBbIHtcbiAgc2NoZW1lIDogJ2h0dHA6Ly93d3cuZmxpY2tyLmNvbS9waG90b3MvKicsXG4gIGVuZHBvaW50IDogJ2h0dHA6Ly93d3cuZmxpY2tyLmNvbS9zZXJ2aWNlcy9vZW1iZWQvJ1xufSBdO1xuIl19
;