(function() {
    'use strict';

    var fs = require('fs'),
        path = require('path')

    var ProjectDetector = function (dir) {
        this.rootDir = dir
    }

    ProjectDetector.prototype.obtainType = function () {
        var self = this

        var result = {
            'eclipse' : self.callEclipsePolicy(),
            'androidstudio' : self.callAndroidStudioPolicy(),
            'intellijidea' : self.callIntelliJIdeaPolicy()
        }

        var maxKey = null
        for(var key in result) {
            if (maxKey === null) {
                maxKey = key
            } else if (result[key] > result[maxKey]) {
                maxKey = key
            }
        }

        return maxKey
    }

    ProjectDetector.prototype.callEclipsePolicy = function () {
        var score = 0
    }

    ProjectDetector.prototype.callAndroidStudioPolicy = function () {
        var self = this
        var score = 0
        if (fs.existsSync(path.join(self.rootDir, 'build.gradle'))) {
            score++
        }
        if (fs.existsSync(path.join(self.rootDir, 'settings.gradle'))) {
            score++
            var gradleSettings = fs.readFileSync(path.join(self.rootDir, 'settings.gradle'))
        }
    }

    ProjectDetector.prototype.callIntelliJIdeaPolicy = function () {
        var score = 0
    }

    module.exports = ProjectDetector
})()