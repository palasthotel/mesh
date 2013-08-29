if (typeof module == 'object')
  module.indexOf = indexOf;

/**
 * Get index of `obj` in `arr`.
 * 
 * @param arr
 * @param obj
 * @returns
 */
function indexOf(arr, obj) {
  if (arr.indexOf)
    return arr.indexOf(obj);

  for ( var i = 0; i < arr.length; i++) {
    if (arr[i] === obj)
      return i;
  }
  return -1;
};
