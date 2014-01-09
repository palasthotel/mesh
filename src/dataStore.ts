/**
 * Stores arbitrary data along with any HTMLElement.
 */
(<any> document).meshDataStore = {};

export function get(elem: HTMLElement): any {
  var data = (<any> document).meshDataStore[elem];

  if (typeof data == 'undefined') {
    data = {};
    (<any> document).meshDataStore[elem] = data;
  }

  return data;
};
