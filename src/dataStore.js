/**
 * Data Store.
 * 
 * @module dataStore
 * 
 * @author Paul Vorbach
 * @since 0.0.1
 */

/**
 * Get a reference to the stored data object for `elem`.
 * 
 * @example
 * 
 * var dataStore = require('./dataStore.js');
 * 
 * var elem = document.getElementById('elem');
 * 
 * var data = dataStore.get(elem);
 * data.foo = 'bar';
 * 
 * 
 * @param {HTMLElement} elem - html element
 */
exports.get = function(elem) {
  var data = elem.meshData;
  if (typeof data === 'undefined') {
    data = {};
    elem.meshData = data;
  }

  return data;
};
