'use strict';

module.exports.replace = function (lines, startLineNumber, endLineNumber, key, target) {
    for(var i = startLineNumber; startLineNumber <= endLineNumber; i++) {
        lines[i] = lines[i].replace(key, target)
    }
}

module.exports.replaceLine = function (lines, lineNumber, key, target) {
    lines[i] = lines[i].replace(key, target)
}