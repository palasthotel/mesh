/**
* Stores arbitrary data along with any HTMLElement.
*/
function get(elem) {
    var data = elem.meshData;
    if (typeof data === 'undefined') {
        data = {};
        elem.meshData = data;
    }

    return data;
}
exports.get = get;
;
