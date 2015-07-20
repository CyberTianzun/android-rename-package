'use strict';

var fs = require('fs'), 
    path = require('path'),
    expat = require('node-expat'),
    writeLines = require('./writeline.js')

var RenameHandler = function (dir, encoding) {
    this.dir = dir
    this.encoding = encoding
    this.returnSymbol = '\n'
    this.errorHandler = function (error) {
        console.error(error)
    }
}

RenameHandler.prototype.setNewPackageName = function (newPackageName) {
    this.newPackageName = newPackageName
}

RenameHandler.prototype.setEncoding = function (encoding) {
    this.encoding = encoding
}

// parse package name from android manifest file
// then set the value to `this.oldPackageName`
RenameHandler.prototype.obtainPackageName = function (filename) {
    var self = this
    var filepath = path.join(this.dir, filename)
    var content = fs.readFileSync(filepath)
    var lines = content.toString().split('\n')
    var modifyPoints = {
        filename : filename,
        filepath : filepath,
        lines : lines,
        'packages' : [ ]
    }
    var currentLineNumber

    // sax parse xml file
    var parser = new expat.Parser(this.encoding)
    parser.on('startElement', function (name, attrs) {
        if (name.match(/manifest/i)) {
            console.log('found oldPackageName => ' + attrs.package)
            self.oldPackageName = attrs.package
        }
    })

    parser.on('error', this.errorHandler)
    
    for(var i in lines) {
        currentLineNumber = i
        parser.write(lines[i])
    }

    if (modifyPoints.packages.length == 0) {
        delete modifyPoints.packages
    }

    return modifyPoints
}

// parse resource to list all the modify point about custom xmlns defines
// almost it's a layout resource file
RenameHandler.prototype.parseResource = function (filename) {
    var self = this
    // cache file to memory
    var filepath = path.join(this.dir, filename)
    var content = fs.readFileSync(filepath)
    var lines = content.toString().split('\n')
    var modifyPoints = {
        filename : filename,
        filepath : filepath,
        lines : lines,
        'xmlns' : [ ]
    }
    var currentLineNumber

    // sax parse xml file
    var parser = new expat.Parser(this.encoding)
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
                console.log('found xml define: ' + attrName + " => " + attrs[attrName])
                modifyPoints.xmlns.push({
                    'line' : currentLineNumber,
                    'source' : attrs[attrName]
                })
            }
        }
    })

    parser.on('error', self.errorHandler)

    for(var i in lines) {
        currentLineNumber = i
        parser.write(lines[i])
    }

    if (modifyPoints.xmlns.length == 0) {
        delete modifyPoints.xmlns
    }

    return modifyPoints
}

// parse android manifest to list all the modify point about authorities of provider and action
RenameHandler.prototype.parseAndroidManifest = function (filename) {
    // cache file to memory
    var filepath = path.join(this.dir, filename)
    var content = fs.readFileSync(filepath)
    var lines = content.toString().split('\n')
    var modifyPoints = {
        filename : filename,
        filepath : filepath,
        lines : lines,
        providers : [ ],
        actions : [ ]
    }
    var currentLineNumber

    // sax parse xml file
    var parser = new expat.Parser(this.encoding)
    parser.on('startElement', function (name, attrs) {
        if (name.match(/provider/i)) {
            if (attrs['android:authorities'] !== undefined) {
                console.log('found provider authorities need to modify => ' + attrs['android:authorities'])
                modifyPoints.providers.push({
                    'line' : currentLineNumber,
                    'source' : attrs['android:authorities']
                })
            } else {
                console.log('found provider need to add a special authorities => ' + attrs['android:name'])
                modifyPoints.providers.push({
                    'line' : currentLineNumber,
                    'source' : '>',
                    'action' : 'add'
                })
            }
        } else if (name.match(/action/i)) {
            if (attrs['android:name'] !== undefined) {
                // this action is not a system action
                if (!attrs['android:name'].match(/^android\.intent\.action\./)) {
                    console.log('found action need to change => ' + attrs['android:name'])
                    modifyPoints.actions.push({
                        'line' : currentLineNumber,
                        'source' : attrs['android:name']
                    })
                }
            }
        }
    })

    parser.on('error', this.errorHandler)
    for(var i in lines) {
        currentLineNumber = i
        parser.write(lines[i])
    }

    if (modifyPoints.providers.length == 0) {
        delete modifyPoints.providers
    }

    if (modifyPoints.actions.length == 0) {
        delete modifyPoints.actions
    }
    
    return modifyPoints
}

// parse java file to list all the modify point about import line which is `.R` and `.BuildConfig`
RenameHandler.prototype.parseJava = function (filename) {
    // cache file to memory
    var filepath = path.join(this.dir, filename)
    var content = fs.readFileSync(filepath)
    var lines = content.toString().split('\n')
    var modifyPoints = {
        filename : filename,
        filepath : filepath,
        lines : lines,
        'imports' : [ ]
    }

    // read each line
    for(var i in lines) {
        // filter import define line
        var importClass = lines[i].match(/^\s*import (.*);/)
        if (importClass) {
            if (importClass[1].match(this.oldPackageName + '.R')) {
                console.log('found import line need to change => ' + this.oldPackageName + '.R')
                modifyPoints.imports.push({
                    'line' : i,
                    'source' : this.oldPackageName + '.R'
                })
            } else if (importClass[1].match(this.oldPackageName + '.BuildConfig')) {
                console.log('found import line need to change => ' + this.oldPackageName + '.BuildConfig')
                modifyPoints.imports.push({
                    'line' : i,
                    'source' : this.oldPackageName + '.BuildConfig'
                })
            }
        }
    }

    if (modifyPoints.imports.length == 0) {
        delete modifyPoints.imports
    }

    return modifyPoints
}

// rewrite resource file from modify points
RenameHandler.prototype.rewriteResource = function(lines, modifyPoints, options) {
    var self = this
    if (modifyPoints.xmlns !== undefined) {
        for(var modifyPoint in modifyPoints.xmlns) {
            var lineNumber = modifyPoints.xmlns[modifyPoint].line
            var newLine = lines[lineNumber].replace(self.oldPackageName, self.newPackageName)
            console.log('modify point (' + modifyPoints.filename + ': ' + lineNumber + ') ' + lines[lineNumber].trim() + ' -> ' + newLine.trim())
            lines[lineNumber] = newLine
        }

        writeLines(modifyPoints.filepath, lines, self.encoding, self.returnSymbol)
    } else {
        if (options.verbose) {
            console.log('skip ' + modifyPoints.filepath)    
        }
    }
}

RenameHandler.prototype.rewriteAndroidManifest = function (lines, modifyPoints, options) {
    var self = this
    var modifiedFlag = false

    if (self.modifyPointsCahce === undefined) {
        self.modifyPointsCahce = {
            'providers' : [ ],
            'actions' : [ ]
        }
    }

    if (modifyPoints.packages && modifyPoints.packages.length > 0) {
        modifiedFlag = true

        for(var modifyPoint in modifyPoints.packages) {
            var lineNumber = modifyPoints.packages[modifyPoint].line
            var newLine = lines[lineNumber].replace(self.oldPackageName, self.newPackageName)
            console.log('modify point (' + modifyPoints.filename + ': ' + lineNumber + ') ' + lines[lineNumber].trim() + ' -> ' + newLine.trim())
            lines[lineNumber] = newLine
        }
    }

    if (options && options.modifyProviders && modifyPoints.providers && modifyPoints.providers.length > 0) {
        modifiedFlag = true
        for(var modifyPoint in modifyPoints.providers) {
            var lineNumber = modifyPoints.providers[modifyPoint].line
            self.modifyPointsCahce.providers.push(modifyPoints.providers[modifyPoint])
            //TODO: modify providers
        }
    }

    if (options && options.modifyActions && modifyPoints.actions && modifyPoints.actions.length > 0) {
        modifiedFlag = true
        for(var modifyPoint in modifyPoints.actions) {
            var lineNumber = modifyPoints.actions[modifyPoint].line
            self.modifyPointsCahce.actions.push(modifyPoints.actions[modifyPoint])
            //TODO: modify actions
        }
    }

    if (self.modifyPointsCahce && self.modifyPointsCahce.providers && self.modifyPointsCahce.providers.length == 0) {
        delete self.modifyPointsCahce.providers
    }

    if (self.modifyPointsCahce && self.modifyPointsCahce.actions && self.modifyPointsCahce.actions.length == 0) {
        delete self.modifyPointsCahce.actions
    }

    if (modifiedFlag) {
        writeLines(modifyPoints.filepath, lines, self.encoding, self.returnSymbol)
    } else {
        if (options.verbose) {
            console.log('skip ' + modifyPoints.filepath)    
        }
    }
}

RenameHandler.prototype.rewriteJava = function (lines, modifyPoints, options) {
    var self = this
    var modifiedFlag = false

    if (modifyPoints.imports !== undefined && modifyPoints.imports.length > 0) {
        modifiedFlag = true
        for(var modifyPoint in modifyPoints.imports) {
            var lineNumber = modifyPoints.imports[modifyPoint].line
            var newLine = lines[lineNumber].replace(self.oldPackageName, self.newPackageName)
            console.log('modify point (' + modifyPoints.filename + ': ' + lineNumber + ') ' + lines[lineNumber].trim() + ' -> ' + newLine.trim())
            lines[lineNumber] = newLine
        }
    }

    // TODO: modify ContentProvider in java files
    // such a string which contains 'content://xxxxx.xxxxx'
    if (options && options.modifyProviders && self.modifyPointsCahce && self.modifyPointsCahce.providers) {
        
    }

    // TODO: modify Action in java files
    // such a string which contains 'ACTION_NAME'
    if (options && options.modifyActions && self.modifyPointsCahce && self.modifyPointsCahce.actions) {
        
    }

    if (modifiedFlag) {
        writeLines(modifyPoints.filepath, lines, self.encoding, self.returnSymbol)
    } else {
        if (options.verbose) {
            console.log('skip ' + modifyPoints.filepath)    
        }
    }
}

module.exports = RenameHandler
