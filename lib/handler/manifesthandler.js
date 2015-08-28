'use strict';

var expat = require('node-expat'),
    lineScanner = require('../scanner/linescanner.js'),
    replaceHelper = require('../utils/replacehelper.js'),
    writeLines = require('../utils/writelines.js')

module.exports.obtainPackageName = function (filename, context) {
    var parser = new expat.Parser(context.encoding)

    // sax parse xml file
    parser.on('startElement', function (name, attrs) {
        if (name.match(/manifest/i)) {
            context.log.i('found oldPackageName => ' + attrs.package)
            context.oldPackageName = attrs.package
        }
    })

    lineScanner.eachLine(filename, function (line, linenumber, file) {
        parser.write(line)
    })
}

module.exports.rewrite = function (filename, context) {
    var parser = new expat.Parser(context.encoding)
    var modified = false
    var currentLineNumber = 0
    var bufferLineNumber = 0
    var file

    // sax parse xml file
    parser.on('startElement', function (name, attrs) {
        if (name.match(/manifest/i)) {
            if (context.oldPackageName == attrs.package) {
                modified = true
                var policy = context.policy.rewritePackageName(context)
                context.log.i('modify package name ' + policy.source + ' => ' + policy.target)
                replaceHelper.replace(
                    file.lines,
                    bufferLineNumber,
                    currentLineNumber,
                    policy.source,
                    policy.target
                    )
            }
        } else if (name.match('provider')) {
            if (context.modifyProvider) {
                modified = true
                var policy = context.policy.rewriteProvider(context, attrs['android:name'], attrs['android:authorities'])

                // replace provider define
                if (attrs['android:authorities'] !== undefined) {
                    context.log.i('modify provider authorities: ' + policy.source + ' => ' + policy.target)
                    replaceHelper.replace(
                        file.lines,
                        bufferLineNumber,
                        currentLineNumber,
                        policy.source,
                        policy.target
                        )
                } else {
                    policy.source = attrs['android:name']
                    context.log.i('add authorities to provider: ' + policy.source + ' +> ' + policy.target)
                    var endSymbol = file.lines[currentLineNumber].match(/(\/?>)/)[1]
                    replaceHelper.replaceLine(
                        file.lines,
                        currentLineNumber,
                        endSymbol,
                        ' android:authorities="' + policy.target + '" ' + endSymbol
                        )
                }

                // add it to context
                if (context.providers === undefined) {
                    context.providers = { }
                }
                context.providers[policy.source] = policy.target
            }
        } else if (name.match('action')) {
            if (context.modifyAction) {
                if (attrs['android:name'] !== undefined) {
                    // this action is not a system action
                    if (!attrs['android:name'].match(/^android\.intent\.action\./)) {
                        modified = true
                        var policy = context.policy.rewriteAction(context, attrs['android:name'])

                        // replace action define
                        context.log.i('modify action name:' + policy.source + ' => ' + policy.target)
                        replaceHelper.replace(
                            file.lines,
                            bufferLineNumber,
                            currentLineNumber,
                            policy.source,
                            policy.target
                            )

                        // add it to context
                        if (context.actions === undefined) {
                            context.actions = { }
                        }
                        context.actions[policy.source] = policy.target
                    }
                }
            }
        } else if (name.match('activity')) {
            // TODO:  modify android:name like android:name=".MainActivity"
            // if (attrs['android:name'].match(/^\./)) {
            //     modified = true
            // }
        }

        if (name.match('service') || name.match('receiver') || name.match('provider')) {
            if (context.modifyProcess) {
                if (attrs['android:process'] !== undefined) {
                    if (attrs['android:process'].match(/^:/)) {
                        return
                    }

                    modified = true
                    var policy = context.policy.rewriteProcess(context, name, attrs['android:name'], attrs['android:process'])

                    // replace service process define
                    context.log.i('modify ' + name + ' process: ' + policy.source + ' => ' + policy.target)
                    replaceHelper.replace(
                        file.lines,
                        bufferLineNumber,
                        currentLineNumber,
                        policy.source,
                        policy.target
                        )

                    // add it to context
                    if (context.processes === undefined) {
                        context.processes = { }
                    }
                    context.processes[policy.source] = policy.target
                }
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
