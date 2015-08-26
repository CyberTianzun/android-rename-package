'use strict';

module.exports.replace = function (lines, startLineNumber, endLineNumber, key, target) {
    for(var i = startLineNumber; startLineNumber <= endLineNumber; i++) {
        lines[i] = lines[i].replace(key, target)
    }
}