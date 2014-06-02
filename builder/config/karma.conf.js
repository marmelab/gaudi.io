/*global module*/
module.exports = function (config) {
    'use strict';

    config.set({
        basePath: '../',

        frameworks: ['jasmine'],

        files: [
            {pattern: '../bower_components/zeroclipboard/ZeroClipboard.js'},
            {pattern: 'dist/js/app.js'},
            {pattern: 'tests/lib/angular/angular-mocks.js'},
            {pattern: 'tests/unit/**/*.js'}
        ],

        autoWatch: true,

        browsers: ['PhantomJS'],
        singleRun: false,
        colors: true,

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],

        preprocessors: {
        }
    });
};
