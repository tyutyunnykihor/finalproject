var gulp = require('gulp'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpIf = require('gulp-if'),
    util = require('gulp-util'),
    sync = require('browser-sync').create();


var IS_DEV = true;

var paths = {
    pathsrc: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcLess: 'src/styles/*.less',
    srcJS: 'src/**/*.js',
    dist: 'dist',
    distIndex:                                                                                                                                                                                                                                                                             'dist/index.html',
    distCSS: 'dist/css/*.css',
    distJS: 'dist/**/*.js'
};


gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['html','less'], function() {
    sync.init({
        server: 'dist'
    });

    gulp.watch('src/styles/style.less', ['less']);
    gulp.watch('src/index.html', ['html']);
    gulp.watch('dist/index.html').on('change', sync.reload);
});

gulp.task('less', function () {
    return gulp.src(paths.srcLess)
        .pipe(gulpIf(IS_DEV, sourcemaps.init()))
        .pipe(less()).on('error', util.log)
        .pipe(rename('app.min.css'))
        .pipe(cssnano())
        .pipe(gulpIf(IS_DEV, sourcemaps.write()))
        .pipe(gulp.dest('dist/css'))
        .pipe(sync.stream());
});

gulp.task('default', ['watch']);