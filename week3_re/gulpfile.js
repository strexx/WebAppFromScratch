// Load plugins
var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cssnano = require('gulp-cssnano');

// Styles
gulp.task('styles', function (cb) {
    gulp.src(['./static/css/style.css', './static/css/pull-refresh.css'])
        .pipe(concat('main.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css/'))
});

// Scripts
gulp.task('scripts', function (cb) {
    gulp.src(['./static/modules/app_start.js', './static/modules/app_init.js', './static/modules/app_router.js', './static/modules/app_get.js', './static/modules/app_render.js', './static/modules/app_end.js'])
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// Default task
gulp.task('default', function () {
    gulp.start('styles', 'scripts');
});