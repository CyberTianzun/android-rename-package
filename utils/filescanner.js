'use strict';

var fs = require('fs'),
    path = require('path')

var FileScanner = function (dir) {
    this.rootDir = dir
}

FileScanner.prototype.each = function (callback) {
    var self = this

    var handler = function (currentPath, relativePath, filename) {
        var fileStat = fs.statSync(currentPath)
        if (fileStat.isDirectory()) {
            var files = fs.readdirSync(currentPath)
            var currentRelativePath = path.join(relativePath, filename)
            for(var index in files) {
                handler(path.join(currentPath, files[index]), currentRelativePath, files[index])
            }
        } else if (fileStat.isFile()) {
            callback(currentPath, relativePath, filename)
        }
    }

    handler(self.rootDir, '.', '.')
}

module.exports = FileScanner