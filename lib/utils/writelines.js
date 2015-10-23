(function() {
    'use strict';

    var fs = require('fs')

    module.exports = function (filepath, lines, encoding, returnSymbol) {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }

        var options = { 
            encoding : encoding 
        }

        var flag = false
        for(var lineNumber in lines) {
            if (flag) {
                fs.appendFileSync(filepath, returnSymbol, options)
            }
            fs.appendFileSync(filepath, lines[lineNumber], options)
            flag = true
        }
    }
})()