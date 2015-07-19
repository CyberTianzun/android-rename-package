'use strict';

var path = require('path'),
    ProjectDetector = require('../utils/prjdetector.js')

var rootDir = '/Users/hiro/online/poorword'

console.log('root dir => ' + rootDir)
var pd = new ProjectDetector(rootDir)

var type = pd.obtainType()
console.log('this is a ' + type + ' project.')