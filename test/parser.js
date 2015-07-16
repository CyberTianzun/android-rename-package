'use strict';

var path = require('path'),
    RenameHandler = require('../utils/renamehandler.js')

var rh = new RenameHandler(__dirname, "utf-8")

console.log('parse packageName: ')
rh.parsePackageName('./usecase/testmanifest.xml')

console.log('parse resource: ')
rh.parseResource('./usecase/testresource.xml')
