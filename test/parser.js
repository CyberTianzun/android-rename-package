'use strict';

var path = require('path'),
    RenameHandler = require('../utils/renamehandler.js')

var rh = new RenameHandler(__dirname, "utf-8")
var mp

var newPackageName = 'cn.hiroz.android.test.project'

console.log('new package name => ' + newPackageName)
rh.setNewPackageName(newPackageName)

console.log('parse packageName: ')
rh.parsePackageName('./usecase/testmanifest.xml')

console.log('parse resource: ')
mp = rh.parseResource('./usecase/testresource.xml')
console.log(mp)

console.log('parse java: ')
mp = rh.parseJava('./usecase/testjava.java')
console.log(mp)