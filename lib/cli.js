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
    .option('--with-services', 'modify services process name. default is false')
    .option('--prjtype', 'is either a eclipse project or android studio project')
    .option('--main-project', 'set main project, when hava many library.')
    .option('-P, --policy <jsconfig>', 'Custom rename policy via javascript file.')
    .action(function(dir, options){
        var context = new core.Context()

        options.newPackageName = options.packageName

        if (options.verbose) {
            context.verbose = true
        }

        if (options.withProviders) {
            context.modifyProvider = true
        }

        if (options.withActions) {
            context.modifyActions = true
        }

        if (options.withServices) {
            context.modifyService = true
        }

        if (options.policy) {
            context.loadPolicy(options.policy)
        }

        core.run(path.join(__dirname, dir), context)
    }).on('--help', function() {

    })

module.exports = program