'use strict';

module.exports.replace = function (lines, startLineNumber, endLineNumber, key, target) {
    for(var i = startLineNumber; i <= endLineNumber && endLineNumber < lines.length; i++) {
        lines[i] = lines[i].replace(key, target)
    }
}

module.exports.replaceLine = function (lines, lineNumber, key, target) {
    lines[lineNumber] = lines[lineNumber].replace(key, target)
}