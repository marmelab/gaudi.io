/*global module*/
module.exports = function (config) {
    'use strict';

    config.set({
        basePath: '../',

        frameworks: ['jasmine'],

        files: [
            {pattern: 'dist/app.js'},
            {pattern: 'tests/lib/angular/angular-mocks.js', included: false}
        ],

        autoWatch: true,

        browsers: ['Chrome'],
        singleRun: false,
        colors: true,

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine'
        ],

        preprocessors: {
        }
    });
};
