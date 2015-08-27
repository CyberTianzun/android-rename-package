'use strict';

var expat = require('node-expat'),
    lineScanner = require('../scanner/linescanner.js'),
    replaceHelper = require('../utils/replacehelper.js'),
    writeLines = require('../utils/writelines.js')

module.exports.rewrite = function (filename, context) {
    var parser = new expat.Parser(context.encoding)
    var modified = false
    var currentLineNumber = 0
    var bufferLineNumber = 0
    var file

    // sax parse xml file
    parser.on('startElement', function (name, attrs) {
        for(var attrName in attrs) {
            if (attrName.match(/^xmlns:/i)) {
                if (attrs[attrName].match('http://schemas.android.com/apk/res-auto')) {
                    continue
                } else if (attrs[attrName].match('http://schemas.android.com/apk/res/android')) {
                    continue
                } else if (attrs[attrName].match('http://schemas.android.com/tools')) {
                    continue
                }
                modified = true
                var policy = context.policy.rewriteLayoutXmlns(context, attrs[attrName])
                context.log.i('modify xml define: ' + policy.source + " => " + policy.target)
                replaceHelper.replace(
                    file.lines,
                    bufferLineNumber,
                    currentLineNumber,
                    policy.source,
                    policy.target
                    )
            }
        }
        bufferLineNumber = currentLineNumber
    })

    parser.on('endElement', function (name) {
        bufferLineNumber = currentLineNumber
    })

    lineScanner.eachLine(filename, function (line, linenumber, fileBuffer) {
        currentLineNumber = linenumber
        file = fileBuffer
        parser.write(line)
    })

    if (modified) {
        context.log.i('write file: ' + filename)
        writeLines(filename, file.lines, context.encoding, context.returnSymbol)
    }
}
