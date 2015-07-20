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
    } else if (process.argv[i].match(/^--?v(erbose)?$/i)) {
        options.verbose = true
    } else if (process.argv[i].match(/^--?with-providers/i)) {
        options.modifyProviders = true
    } else if (process.argv[i].match(/^--?with-actions/i)) {
        options.modifyActions = true
    } else if (process.argv[i].match(/^--?prjtype/i)) {
        options.projectType = process.argv[i + 1]
        i++
    } else if (process.argv[i].match(/^--?main-project/)) {
        options.mainProject = process.argv[i + 1]
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

var FileScanner = require('./utils/filescanner.js'),
    RenameHandler = require('./utils/renamehandler.js')

var detectProjects = function (dir) {
    options.projects = [ ]
    if (fs.existsSync(path.join(dir, 'settings.gradle'))) {
        var lines = fs.readFileSync(path.join(dir, 'settings.gradle')).toString().split('\n')
        for(var i in lines) {
            if (lines[i].trim().match(/^include '.+'$/i)) {
                var projectPath = lines[i].trim().match(/^include ':(.+)'$/i)[1].replace(':', '/')
                options.projects.push(projectPath)
                if (options.mainProject === undefined && projectPath.match(/app/i)) {
                    options.mainProject = projectPath
                }
            }
        }
    }
}

detectProjects(options.rootDir)

if (options.projects.length == 0) {
    console.log('found not any project')
    process.exit(-1)
}

if (options.mainProject === undefined) {
    console.log('cannot detect main project, u can use --main-project to set this value manually')
    process.exit(-1)
}

console.log('init configuration')
console.log(options)

var rh = new RenameHandler(options.rootDir, 'utf-8')
var mp

rh.setNewPackageName(options.newPackageName)

mp = rh.obtainPackageName(path.join(options.mainProject, 'AndroidManifest.xml'))
rh.rewriteAndroidManifest(mp.lines, mp, options)

for(var i in options.projects) {
    mp = rh.parseAndroidManifest(path.join(options.projects[i], 'AndroidManifest.xml'))
    rh.rewriteAndroidManifest(mp.lines, mp, options)
}

for(var i in options.projects) {
    var resPath = path.join(options.rootDir, path.join(options.projects[i], 'res'))

    FileScanner.each(resPath, function (currentPath, relativePath, filename) {
        if (filename.match(/\.xml$/i)) {
            var resFile = path.join(path.join(options.projects[i], 'res'), path.join(relativePath, filename))
            mp = rh.parseResource(resFile)
            rh.rewriteResource(mp.lines, mp, options)
        }
    })

    var srcPath = path.join(options.rootDir, path.join(options.projects[i], 'src'))
    FileScanner.each(srcPath, function (currentPath, relativePath, filename) {
        if (filename.match(/\.java$/i)) {
            var srcFile = path.join(path.join(options.projects[i], 'src'), path.join(relativePath, filename))
            mp = rh.parseJava(srcFile)
            rh.rewriteJava(mp.lines, mp, options)
        }
    })
}
