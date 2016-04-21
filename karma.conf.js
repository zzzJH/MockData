// Karma configuration
// Generated on Wed Nov 25 2015 16:36:04 GMT+0800 (CST)

var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        browsers: [ 'Chrome' ],
        files: [
            'test.webpack.js'
        ],
        frameworks: [ 'jasmine' ],  //[ 'chai', 'mocha' ]
        autoWatch: true,
        preprocessors: {
            'test.webpack.js':['webpack']
        },
        reporters: [ 'progress' ],  // possible values:'spec', 'dots', 'progress', 'junit', 'growl', 'coverage'
        singleRun: false,
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};