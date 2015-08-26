'use strict';

var lineScanner = require('../scanner/linescanner.js'),
    replaceHelper = require('../utils/replacehelper.js'),
    writeLines = require('../utils/writelines.js')

module.exports.rewrite = function (filename, context) {
    lineScanner.eachLine(filename, function (line, linenumber, file) {
        var importClass = lines[i].match(/^\s*import (.*);/)
        if (importClass) {
            modified = true
            var policy = context.policy.rewriteJavaImports(context, importClass[1])
            context.log.i('modify java imports: ' + policy.source + " => " + policy.target)
            replaceHelper.replaceLine(
                file.lines,
                linenumber,
                policy.source,
                policy.target
                )
            // if (importClass[1].match(this.oldPackageName + '.R')) {
            //     console.log.i('found import line need to change => ' + this.oldPackageName + '.R')
            //     modifyPoints.imports.push({
            //         'line' : i,
            //         'source' : this.oldPackageName + '.R'
            //     })
            // } else if (importClass[1].match(this.oldPackageName + '.BuildConfig')) {
            //     context.log.i('found import line need to change => ' + this.oldPackageName + '.BuildConfig')
            //     modifyPoints.imports.push({
            //         'line' : i,
            //         'source' : this.oldPackageName + '.BuildConfig'
            //     })
            // }
        }

        // TODO: modify ContentProvider in java files
        // such a string which contains 'content://xxxxx.xxxxx'
        if (context.modifyProvider && context.providers) {
            for (var provider in context.providers) {
                if (line.match("content://" + providers)) {
                    context.log.i('modify provider authorities in java: ' + provider + ' => ' + context.providers[provider])
                    replaceHelper.replaceLine(
                        file.lines,
                        linenumber,
                        provider,
                        context.providers[provider])
                        )
                }
            }
        }

        // TODO: modify Action in java files
        // such a string which contains 'ACTION_NAME'
        if (context.modifyAction && context.actions) {
            for (var action in context.actions) {
                if (line.match("content://" + actions)) {
                    context.log.i('modify action name in java: ' + action + ' => ' + context.actions[action])
                    replaceHelper.replaceLine(
                        file.lines,
                        linenumber,
                        action,
                        context.actions[action])
                        )
                }
            }
        }
    })

    if (modified) {
        context.log.i('write file: ' + filename)
        writeLines(filename, context.lines, context.encoding, context.returnSymbol)
    }
})
