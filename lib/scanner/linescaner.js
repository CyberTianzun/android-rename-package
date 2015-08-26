'use strict';

var fs = require('fs')

var each = function(filename, callback) {
    var content = fs.readFileSync(filepath)
    var lines = content.toString().split('\n')
    var context = {
        filename : filename,
        lines : lines
    }
    for(var currentLineNumber in lines) {
        callback(lines[i], currentLineNumber, context)
    }
}

module.exports.each = each
module.exports.eachLine = each