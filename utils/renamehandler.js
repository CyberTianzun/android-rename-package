'use strict';

var fs = require('fs'), 
    path = require('path'),
    expat = require('node-expat')

var RenameHandler = function (dir, encoding) {
    this.dir = dir
    this.encoding = encoding
    this.errorHandler = function (error) {
        console.error(error)
    }
}

// parse package name from android manifest file
// then set the value to `this.oldPackageName`
RenameHandler.prototype.parsePackageName = function (filename) {
    var self = this
    var filepath = path.join(this.dir, filename)

    // sax parse xml file
    var parser = new expat.Parser(this.encoding)
    parser.on('startElement', function (name, attrs) {
        if (name.match(/manifest/i)) {
            console.log('found oldPackageName => ' + attrs.package)
            self.oldPackageName = attrs.package
        }
    })

    parser.on('error', this.errorHandler)
    parser.write(fs.readFileSync(filepath))
}

// parse resource to list all the modify point about custom xmlns defines
// almost it's a layout resource file
RenameHandler.prototype.parseResource = function (filename) {
    // cache file to memory
    var filepath = path.join(this.dir, filename)
    var content = fs.readFileSync(filepath)

    // sax parse xml file
    var parser = new expat.Parser(this.encoding)
    parser.on('startElement', function (name, attrs) {
        for(var attrName in attrs) {
            if (attrName.match(/^xmlns:/i)) {
                console.log('found xml define: ' + attrName + " => " + attrs[attrName])
            }
        }
    })

    parser.on('error', this.errorHandler)
    parser.write(content)
}

// parse android manifest to list all the modify point about authorities of provider and action
RenameHandler.prototype.parseAndroidManifest = function (filename) {
    // cache file to memory
    var filepath = path.join(this.dir, filename)
    var content = fs.readFileSync(filepath)

    // sax parse xml file
    var parser = new expat.Parser(this.encoding)
    parser.on('startElement', function (name, attrs) {
        for(var attrName in attrs) {
            if (attrName.match(/provider/i)) {
                if (attrs['android:authorities'] !== undefined) {
                    console.log('found provider authorities need to modify => ' + attrs['android:authorities'])
                } else {
                    console.log('found provider need to add a special authorities => ' + attrs['android:name'])
                }
            } else if (attrName.match(/action/i)) {
                if (attrs['android:name'] !== undefined) {
                    // this action is not a system action
                    if (attrs['android:name'].match(/^com\.android\.intent\.action\./)) {
                        console.log('found action need to change => ' + attrs['android:name'])
                    }
                }
            }
        }
    })

    parser.on('error', this.errorHandler)
    parser.write(content)
}

// parse java file to list all the modify point about import line which is .R and .BuildConfig
RenameHandler.prototype.parseJava = function(filename) {
    // cache file to memory
    var filepath = path.join(this.dir, filename)
    var content = fs.readFileSync(filepath)
    var lines = content.split('\n')

    // read each line
    for(var i = 0; i < lines.count; i++) {
        // filter import define line
        var importClass = lines[i].match(/^\s*import (.*);/)
        if (importClass) {
            if (importClass[1].match(this.oldPackageName + '.R')) {
                console.log('found import line need to change => ' + this.oldPackageName + '.R')
            } else if (importClass[1].match(this.oldPackageName + '.BuildConfig')) {
                console.log('found import line need to change => ' + this.oldPackageName + '.BuildConfig')
            }
        }
    }
}

module.exports = RenameHandler
