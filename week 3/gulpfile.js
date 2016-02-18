const gulp = require('gulp');
const babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('default', ['combineJS', 'combineCSS']);

// takes in a callback so the engine knows when it'll be done
gulp.task('combineJS', function (cb) {
    gulp.src(['./node_modules/mustache/mustache.min.js', './node_modules/underscore/underscore-min.js', './static/js/client.js', './static/js/general.js', './static/lib/routie.js', './static/js/routes.js', './static/lib/hammer.2.0.4.js', './static/lib/wptr.1.1.js', './static/js/pull-refresh.js'])
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./static/dist/js/'))
});

gulp.task('combineCSS', function (cb) {
    gulp.src(['./static/css/style.css', './static/css/pull-refresh.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./static/dist/css/'))
});