
function renderObject(obj) {
    var result = '<ul>';
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            result += '<li><strong>' + key + ':</strong> ' + renderJsonValue(obj[key]) + '</li>';
        }
    }
    result += '</ul>';
    return result;
}


function renderJsonValue(value) {
    switch(typeof value) {
        case 'object': return renderObject(value);
        case 'array': return renderArray(value);
        default: return value.toString();
    }
}


function renderArray(value) {
    var result = '[';
    for(var i = 0; i < value.length; i++) {
        if(i) result += ', ';
        result += '"' + renderObject(value[i]) + '"';
    }
    return result + ']';
}

module.exports = renderObject;
