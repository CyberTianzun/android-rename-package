'use strict';

var fs = require('fs'), 
    path = require('path'),
    expat = require('node-expat')

var RenameHandler = function(dir, encoding) {
    this.dir = dir
    this.encoding = encoding
}

RenameHandler.prototype.parsePackageName = function(filename) {
    var self = this
    var filepath = path.join(this.dir, filename)

    // sax parse xml file
    var parser = new expat.Parser(this.encoding)
    parser.on('startElement', function (name, attrs) {
        if (name.match(/manifest/i)) {
            console.log('found oldPackageName => ' attrs.package)
            self.oldPackageName = attrs.package
        }
    })

    parser.on('error', function (error) {
        console.error(error)
    })
    parser.write(content)
}

RenameHandler.prototype.parseResource = function(filename) {
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

    parser.on('error', function (error) {
        console.error(error)
    })
    parser.write(content)

    // rewrite xml file
}

RenameHandler.prototype.parseJava = function(filename) {

}

module.exports = RenameHandler
