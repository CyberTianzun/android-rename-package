'use strict';

var path = require('path'),
    defaultPolicy = require('./defaultpolicy.js'),
    manifestHandler = require('../lib/handler/manifesthandler.js'),
    resourceHandler = require('../lib/handler/resourcehandler.js'),
    javaHandler = require('../lib/handler/javahandler.js'),
    pathScanner = require('../scanner/pathscanner.js')

var Context = function () {

    var self = this

    this.log = {
        i : function(s) {
            console.log('i: ' + s)
        },
        w : function(s) {
            console.log('w: ' + s)
        },
        e : function(s) {
            console.log('e: ' + s)
        },
        d : function(s) {
            if (self.verbose) {
               console.log('d: ' + s)
            }
        }
    }

    this.encoding = 'utf-8'

    this.returnSymbol = '\n'

    this.verbose = false

    this.policy = defaultPolicy

}

Context.prototype.loadPolicy = function (filename) {
    var policy = require(filename)
    for (key in policy) {
        this.policy[key] = policy[key]
    }
}

module.exports.Context = Context

module.exports.run = function (context) {

    context.policy.detectProjects(context)

    if (context.projects.length == 0) {
        context.log.e('found not any project')
        process.exit(-1)
    }

    if (context.mainProject === undefined) {
        context.log.e('cannot detect main project, u can use --main-project to set this value manually')
        process.exit(-1)
    }

    manifestHandler.obtainPackageName(path.join(context.mainProject, 'AndroidManifest.xml'), context)

    for (var i in options.projects) {
        manifestHandler.rewrite(path.join(options.projects[i], 'AndroidManifest.xml'), context)
    }

    for(var i in options.projects) {
        var resPath = path.join(options.rootDir, path.join(options.projects[i], 'res'))

        pathScanner.each(resPath, function (currentPath, relativePath, filename) {
            if (filename.match(/\.xml$/i)) {
                var resFile = path.join(path.join(options.projects[i], 'res'), path.join(relativePath, filename))
                resourceHandler.rewrite(resFile, context)
            }
        })

        var srcPath = path.join(options.rootDir, path.join(options.projects[i], 'src'))
        pathScanner.each(srcPath, function (currentPath, relativePath, filename) {
            if (filename.match(/\.java$/i)) {
                var srcFile = path.join(path.join(options.projects[i], 'src'), path.join(relativePath, filename))
                javaHandler.rewrite(srcFile, context)
            }
        })
    }

}

