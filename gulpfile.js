/*global require,console*/
var gulp        = require('gulp');
var browserify  = require('gulp-browserify');
var concat      = require('gulp-concat');
var styl        = require('gulp-styl');
var refresh     = require('gulp-livereload');
var ngmin       = require('gulp-ngmin');
var uglify      = require('gulp-uglify');
var stringify   = require('stringify');
var lr          = require('tiny-lr');
var server      = lr();
var karma       = require('gulp-karma');
var jasmine     = require('gulp-jasmine');

var testFiles   = [
    'builder/tests/unit/services/*.js',
    'builder/dist/app.js'
];

function buildScripts() {
    'use strict';

    gulp.src(['builder/src/js/**/*.js'])
        .pipe(browserify({
            paths: ['builder/src/js/', 'node_modules'],
            transform: [stringify(['.html'])],
            shim: {
                jquery: {
                    path: 'node_modules/jquery/dist/jquery.js',
                    exports: '$'
                },
                'jquery.sortElements': {
                    path: 'node_modules/joint/lib/jquery.sortElements.js',
                    exports: null,
                    depends: {
                        jquery: '$'
                    }
                },
                underscore: {
                    path: 'node_modules/underscore/underscore.js',
                    exports: '_'
                },
                vectorizer: {
                    path: 'node_modules/joint/src/vectorizer.js',
                    depends: {
                        underscore: 'underscore'
                    },
                    exports: 'vectorizer'
                }
            }
        }))
        .pipe(ngmin())
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('builder/dist/js'))
        .pipe(refresh(server));
}

function buildStyles() {
    'use strict';

    gulp.src(['builder/src/css/**/*.css'])
        .pipe(gulp.dest('builder/dist/css'))
        .pipe(refresh(server));
}

function createLiveReloadServer() {
    'use strict';

    server.listen(35729, function (err) {
        if (err) {
            createLiveReloadServer();
        }
    });
}

gulp.task('test', function () {
    'use strict';

    // Be sure to return the stream
    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'builder/config/karma.conf.js',
            action: 'run'
        }))
        //.pipe(jasmine())
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});



gulp.task('default', function () {
    'use strict';

    buildScripts();
    buildStyles();
    createLiveReloadServer();

    gulp.watch('builder/src/js/**', buildScripts);
    gulp.watch('builder/src/css/**', buildStyles);
});
