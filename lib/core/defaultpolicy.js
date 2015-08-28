'use strict';

var path = require('path')

module.exports.rewritePackageName = function (context) {
    return {
        source : context.oldPackageName,
        target : context.newPackageName
    }
}

module.exports.rewriteProvider = function (context, name, authorities) {
    if (authorities) {
        return {
            source : context.oldPackageName,
            target : context.newPackageName
        }    
    } else {
        return {
            source : name,
            target : (context.newPackageName + name).replace('..', '.')
        }
    }
}

module.exports.rewriteAction = function (context, name) {
    return {
        source : context.oldPackageName,
        target : context.newPackageName
    }
}

module.exports.rewriteService = function (context, name, process) {
    return {
        source : context.oldPackageName,
        target : context.newPackageName
    }
}

module.exports.rewriteLayoutXmlns = function (context, xmlns) {
    return {
        source : context.oldPackageName,
        target : context.newPackageName
    }
}

module.exports.rewriteJavaImports = function (context, imports) {
    return {
        source : context.oldPackageName,
        target : context.newPackageName
    }
}

module.exports.detectProjects = function (context, dir) {
    context.projects = [ ]
    if (fs.existsSync(path.join(dir, 'settings.gradle'))) {
        var lines = fs.readFileSync(path.join(dir, 'settings.gradle')).toString().split('\n')
        for(var i in lines) {
            if (lines[i].trim().match(/^include '.+'$/i)) {
                var projectPath = lines[i].trim().match(/^include ':(.+)'$/i)[1].replace(':', '/')
                context.projects.push(projectPath)
                if (context.mainProject === undefined && projectPath.match(/app/i)) {
                    context.mainProject = projectPath
                }
            }
        }
    }
}