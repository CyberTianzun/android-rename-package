'use strict';

var path = require('path'),
    FileScanner = require('../utils/filescanner.js')

var fs = new FileScanner(__dirname)

fs.each(function(currentPath, relativePath, filename) {
    if (filename.match(/\.java$/i)) {
        console.log('found java file: ' + path.join(relativePath, filename))
    } else if (filename.match(/\.xml$/i)) {
        console.log('found xml file: ' + path.join(relativePath, filename))
    }
})