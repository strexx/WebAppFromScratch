// Load plugins
var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cssnano = require('gulp-cssnano'),
    webserver = require('gulp-webserver');

// Styles
gulp.task('styles', function (cb) {
    gulp.src(['./static/css/style.css', './static/css/pull-refresh.css', './static/lib/genericons/genericons.css', './static/css/awesomplete.css'])
        .pipe(concat('main.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./static/dist/css/'))
});

// Scripts
gulp.task('scripts', function (cb) {
    gulp.src(['./static/modules/app_start.js', './static/modules/app_init.js', './static/modules/app_router.js', './static/modules/app_get.js', './static/modules/app_render.js', './static/modules/app_end.js'])
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./static/dist/js/'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      port:'9090',
      livereload: true,
      open: true
    }));
});

// Default task
gulp.task('default', function () {
    gulp.start('styles', 'scripts', 'webserver');
});

// Watch
gulp.task('watch', function () {
    // Watch .css files
    gulp.watch('./static/css/*.css', ['styles']);
    // Watch .js files
    gulp.watch('./static/modules/*.js', ['scripts']);    
});