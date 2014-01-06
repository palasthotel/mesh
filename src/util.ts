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

export function forEach<T>(xs: any, action: (x: T) => void): void {
  [].forEach.call(xs, action);
}

export function xmlEncode(xml: string): string {
  return xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function xmlDecode(encoded: string): string {
  return encoded.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, '\'').replace(/&amp;/g, '&');
}
