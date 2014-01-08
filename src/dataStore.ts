/**
 * Stores arbitrary data along with any HTMLElement.
 */
(<any> document).meshDataStore = {};

export function get(elem: HTMLElement): any {
  return (<any> document).meshDataStore[elem];
};

export function set(elem: HTMLElement, data: any): void {
  (<any> document).meshDataStore[elem] = data;
};

export function unset(elem: HTMLElement): void {
  delete (<any> document).meshDataStore[elem];
};
