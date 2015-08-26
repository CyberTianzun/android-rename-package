'use strict';

var program = require('commander')

program
  .version('1.0.0')
  .option('--verbose', 'verbose mode')
  .option('--with-providers', 'modify provider authorities')
  .option('--with-actions', 'modify action name')
  .option('--prjtype', 'is this a eclipse project or android studio project?')
  .option('--main-project', 'set main project, when hava many library.')

module.exports = program