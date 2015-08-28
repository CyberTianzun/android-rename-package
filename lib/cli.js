'use strict';

var program = require('commander'),
    path = require('path'),
    core = require('./core/index.js')

program
    .version('1.0.0')
    .option('-v, --verbose', 'verbose mode')

program
    .command('r <dir>')
    .description('rename android project')
    .option('-p, --package-name <name>', 'set new package name')
    .option('--with-providers', 'modify provider authorities. default is false')
    .option('--with-actions', 'modify action name. default is false')
    .option('--with-processes', 'modify services, provider, receiver process name. default is false')
    .option('--prjtype <type>', 'is either a eclipse project or android studio project')
    .option('--main-project <dir>', 'set main project, when hava many library.')
    .option('-P, --policy <jsconfig>', 'Custom rename policy via javascript file.')
    .action(function(dir, options){
        var context = new core.Context()

        context.rootDir = path.resolve(dir)

        context.newPackageName = options.packageName

        if (options.verbose) {
            context.verbose = true
        }

        if (options.withProviders) {
            context.modifyProvider = true
        }

        if (options.withActions) {
            context.modifyAction = true
        }

        if (options.withProcesses) {
            context.modifyProcess = true
        }

        if (options.prjtype) {
            context.prjtype = options.prjtype
        }

        if (options.mainProject) {
            context.mainProject = options.mainProject
        }

        if (options.policy) {
            context.loadPolicy(options.policy)
        }

        core.run(context)
    }).on('--help', function() {

    })

module.exports = program