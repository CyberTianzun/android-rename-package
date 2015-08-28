'use strict';

var path = require('path'),
    fs = require('fs')

module.exports.rewritePackageName = function (context) {
    return {
        source : context.oldPackageName,
        target : context.newPackageName
    }
}

module.exports.rewriteProvider = function (context, name, authorities) {
    if (authorities) {
        if (authorities.match(context.oldPackageName)) {
            return {
                source : authorities,
                target : authorities.replace(context.oldPackageName, context.newPackageName)
            }
        } else {
            return {
                source : authorities,
                target : (context.newPackageName + '.' + authorities).replace('..', '.')
            }
        }
    } else {
        return {
            source : name,
            target : (context.newPackageName + '.' + name).replace('..', '.')
        }
    }
}

module.exports.rewriteAction = function (context, name) {
    if (name.match(context.oldPackageName)) {
        return {
            source : name,
            target : name.replace(context.oldPackageName, context.newPackageName)
        }
    } else {
        return {
            source : name,
            target : (context.newPackageName + '.' + name).replace('..', '.')
        }
    }
}

module.exports.rewriteProcess = function (context, tag, name, process) {
    if (process.match(context.oldPackageName)) {
        return {
            source : process,
            target : process.replace(context.oldPackageName, context.newPackageName)
        }
    } else {
        return {
            source : process,
            target : (context.newPackageName + '.' + process).replace('..', '.')
        }
    }
}

module.exports.rewriteLayoutXmlns = function (context, xmlns) {
    return {
        source : xmlns,
        target : xmlns.replace(context.oldPackageName, context.newPackageName)
    }
}

module.exports.rewriteJavaImports = function (context, imports) {
    return {
        source : imports,
        target : imports.replace(context.oldPackageName, context.newPackageName)
    }
}

module.exports.detectProjects = function (context) {
    if (fs.existsSync(path.join(context.rootDir, 'settings.gradle'))) {
        var lines = fs.readFileSync(path.join(context.rootDir, 'settings.gradle')).toString().split('\n')
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