(function() {
    'use strict';

    module.exports.replace = function (lines, startLineNumber, endLineNumber, key, target) {
        var start = parseInt(startLineNumber), end = parseInt(endLineNumber)
        for(var lineNumber = start; lineNumber <= end && lineNumber < lines.length; lineNumber++) {
            lines[lineNumber] = lines[lineNumber].replace(key, target)
        }
    }

    module.exports.replaceLine = function (lines, lineNumber, key, target) {
        lines[lineNumber] = lines[lineNumber].replace(key, target)
    }
})()