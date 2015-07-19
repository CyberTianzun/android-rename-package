'use strict';

var version = '1.0.0'

var fs = require('fs'),
    path = require('path')

var options = { }

if (process.argv.length < 3) {
    console.log('Android Rename Package CLI Tools v' + version)
    console.log('Developped by hiroz.cn')
    process.exit(1)
}

for(var i = 2; i < process.argv.length; i++) {
    if (process.argv[i].match(/^node$/i)) {
        i++
        continue
    } else if (process.argv[i].match(/^--?with-providers/i)) {
        options.modifyProviders = true
    } else if (process.argv[i].match(/^--?with-actions/i)) {
        options.modifyActions = true
    } else if (process.argv[i].match(/^--?prjtype/i)) {
        options.projectType = process.argv[i + 1]
        i++
    } else {
        if (options.rootDir === undefined) {
            if (process.argv[i].match(/^\//)) {
                options.rootDir = process.argv[i]
            } else {
                options.rootDir = path.join(__dirname, process.argv[i])    
            }
            if (fs.existsSync(options.rootDir)) {
                if (!fs.statSync(options.rootDir).isDirectory()) {
                    console.log(options.rootDir + ' is not a directory')
                    process.exit(-1)
                }
            } else {
                console.log('found not ' + options.rootDir)
                process.exit(-1)
            }
        } else {
            options.newPackageName = process.argv[i]
        }
    }
}

console.log('init configuration')
console.log(options)

var FileScanner = require('./utils/filescanner.js'),
    RenameHandler = require('./utils/renamehandler.js')



