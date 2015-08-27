'use strict';

var defaultPolicy = require('./defaultpolicy.js')

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
}

module.exports.Context = Context

module.exports.run = function (dir, context) {
    console.log(dir)
    console.log(context)
}