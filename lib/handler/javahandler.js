'use strict';

var lineScanner = require('../scanner/linescanner.js'),
    replaceHelper = require('../utils/replacehelper.js'),
    writeLines = require('../utils/writelines.js')

module.exports.rewrite = function (filename, context) {
    var modified = false
    var file

    lineScanner.eachLine(filename, function (line, linenumber, fileBuffer) {
        file = fileBuffer
        var importClass = line.match(/^\s*import\s+(.*)\s*;/)
        if (importClass) {
            if (importClass[1].match(context.oldPackageName + ".R") 
                || importClass[1].match(context.oldPackageName + ".BuildConfig")) {
                modified = true
                var policy = context.policy.rewriteJavaImports(context, importClass[1])
                context.log.i('modify java imports: ' + policy.source + " => " + policy.target)
                replaceHelper.replaceLine(
                    file.lines,
                    linenumber,
                    policy.source,
                    policy.target
                    )
            }
        }

        // such a string which contains 'content://xxxxx.xxxxx'
        if (context.modifyProvider && context.providers) {
            for (var provider in context.providers) {
                if (line.match('"content://' + provider + '"') || line.match('"' + provider + '"')) {
                    modified = true
                    context.log.i('modify provider authorities in java: ' + provider + ' => ' + context.providers[provider])
                    replaceHelper.replaceLine(
                        file.lines,
                        linenumber,
                        provider,
                        context.providers[provider]
                        )
                }
            }
        }

        // such a string which contains 'ACTION_NAME'
        if (context.modifyAction && context.actions) {
            for (var action in context.actions) {
                if (line.match('"' + action + '"')) {
                    modified = true
                    context.log.i('modify action name in java: ' + action + ' => ' + context.actions[action])
                    replaceHelper.replaceLine(
                        file.lines,
                        linenumber,
                        action,
                        context.actions[action]
                        )
                }
            }
        }

        // such a string which contains 'PROCESS_NAME'
        if (context.modifyProcess && context.processes) {
            for (var process in context.processes) {
                if (line.match('"' + process + '"')) {
                    modified = true
                    context.log.i('modify process name in java: ' + process + ' => ' + context.processes[process])
                    replaceHelper.replaceLine(
                        file.lines,
                        linenumber,
                        process,
                        context.processes[process]
                        )
                }
            }
        }
    })

    if (modified) {
        context.log.i('write file: ' + filename)
        writeLines(filename, file.lines, context.encoding, context.returnSymbol)
    }
}
