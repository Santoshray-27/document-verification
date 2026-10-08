const crypto = require('crypto');

function canonicalize(obj) {
    if (obj === null || typeof obj !== 'object') {
        if (typeof obj === 'string') {
            return JSON.stringify(obj.normalize('NFC'));
        }
        return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
        const arr = obj.map(item => JSON.parse(canonicalize(item)));
        return JSON.stringify(arr);
    }

    const keys = Object.keys(obj).sort();
    let str = '{';
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        str += JSON.stringify(key.normalize('NFC')) + ':' + canonicalize(obj[key]);
        if (i < keys.length - 1) {
            str += ',';
        }
    }
    str += '}';
    return str;
}

module.exports = { canonicalize };
