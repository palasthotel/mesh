import exceptions = require('./exceptions');

export function requires(condition: boolean, msg: string): void {
  if (!condition)
    throw new exceptions.IllegalArgumentException(msg);
}

export function extend(some: any, other: any): any {
  var result = {};

  for (var prop in some) {
    result[prop] = some[prop];
  }

  for (var prop in other) {
    result[prop] = other[prop];
  }

  return result;
}

export function xmlEncode(xml: string): string {
  return xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function xmlDecode(encoded: string): string {
  return encoded.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, '\'').replace(/&amp;/g, '&');
}

export function forEach<T>(xs: any, action: (x: T) => void): void {
  [].forEach.call(xs, action);
}

/**
 * Maps a function on every item in the given Array.
 */
export function map<T, U>(xs: Array<T>, mapper: (x: T) => U): Array<U> {
  var result = new Array<U>(xs.length);
  for (var i = 0; i < xs.length; i++) {
    result[i] = mapper(xs[i]);
  }
  return result;
}

/**
 * Filters items from the Array using a given function.
 */
export function filter<T>(xs: Array<T>, matcher: (x: T) => boolean): Array<T> {
  var result = new Array<T>();
  var x: T = null;
  for (var i = 0; i < xs.length; i++) {
    x = xs[i];
    if (matcher(x))
      result.push(x);
  }
  return xs;
}
