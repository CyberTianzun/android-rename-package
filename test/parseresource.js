'use strict';

var path = require('path'),
    RenameHandler = require('../utils/renamehandler.js')

var rh = new RenameHandler(__dirname, "utf-8")
rh.parseResource(path.join("./usecase/testresource.xml"))
