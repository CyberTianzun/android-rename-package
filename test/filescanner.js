'use strict';

var path = require('path'),
    FileScanner = require('../lib/scanner/pathscanner.js')

var rootDir = __dirname

console.log('scan root dir => ' + rootDir)
FileScanner.each(rootDir, function (currentPath, relativePath, filename) {
    if (filename.match(/\.java$/i)) {
        console.log('found java file: ' + path.join(relativePath, filename))
    } else if (filename.match(/\.xml$/i)) {
        console.log('found xml file: ' + path.join(relativePath, filename))
    }
})