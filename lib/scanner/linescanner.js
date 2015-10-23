(function() {
    'use strict';

    var fs = require('fs')

    var each = function(filename, callback) {
        var content = fs.readFileSync(filename)
        var lines = content.toString().split('\n')
        var file = {
            filename : filename,
            lines : lines
        }
        for(var currentLineNumber in lines) {
            callback(lines[currentLineNumber], currentLineNumber, file)
        }
    }

    module.exports.each = each
    module.exports.eachLine = each
})()