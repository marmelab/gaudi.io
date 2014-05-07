/*global require,console*/
var gulp        = require('gulp');
var browserify  = require('gulp-browserify');
var concat      = require('gulp-concat');
var styl        = require('gulp-styl');
var refresh     = require('gulp-livereload');
var lr          = require('tiny-lr');
var server      = lr();

function buildScripts() {
    "use strict";

    gulp.src(['builder/src/js/**/*.js'])
        .pipe(browserify({
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
                },
                geometry: {
                    path: 'node_modules/joint/src/geometry.js',
                    exports: 'g'
                }
            }
        }))
        .pipe(gulp.dest('builder/dist/js'))
        .pipe(refresh(server));
}

function buildStyles() {
    "use strict";

    gulp.src(['builder/src/css/**/*.css'])
        .pipe(gulp.dest('builder/dist/css'))
        .pipe(refresh(server));
}

function createLiveReloadServer() {
    "use strict";

    server.listen(35729, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

gulp.task('default', function () {
    "use strict";

    buildScripts();
    buildStyles();
    createLiveReloadServer();

    gulp.watch('builder/src/js/**', buildScripts);
    gulp.watch('builder/src/css/**', buildStyles);
});
