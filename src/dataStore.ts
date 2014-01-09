/**
 * Stores arbitrary data along with any HTMLElement.
 */

export function get(elem: HTMLElement): any {
  var data: any = (<any> elem).meshData;
  if (typeof data === 'undefined') {
    data = {};
    (<any> elem).meshData = data;
  }

  return data;
};
