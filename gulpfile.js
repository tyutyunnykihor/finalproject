var gulp    = require('gulp'),
    del     = require('del'),
    sync    = require('browser-sync').create(),
    gulpIf  = require('gulp-if'),
    util    = require('gulp-util'),
    plugins = require('gulp-load-plugins')({
        scope: ['devDependencies']
    });


var IS_DEV = true;

var paths = {
    pathsrc           : 'src/**/*',
    srcHTML           : 'src/**/*.html',
    srcLess           : 'src/styles/style.less',
    srcJS             : 'src/**/*.js',
    srcIMG            : 'src/img/**/*',
    srcFonts          : 'src/fonts/**/*',
    dist              : 'dist',
    distIndex         : 'dist/index.html',
    distCSS           : 'dist/css/*.css',
    distJS            : 'dist/**/*.js',
    distIMG           : 'dist/img',
    distFonts         : 'dist/fonts/',
    distLib           : 'dist/js/lib',
    distBootstrapCss  : 'dist/css/lib/css',
    distBootstrapFonts: 'dist/css/lib/fonts',
    bootstrapCSS      : "./node_modules/bootstrap/dist/css/bootstrap.min.css",
    bootstrapFonts    : "./node_modules/bootstrap/dist/fonts/*",
    lib : [
        "./node_modules/jquery/dist/jquery.js",
        "./node_modules/bootstrap/dist/js/bootstrap.js"
    ]
};


gulp.task('html', function () {
    return gulp.src(paths.srcHTML)
        .pipe(plugins.htmlExtend())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('styles:app', function () {
    return gulp.src(paths.srcLess)
        .pipe(gulpIf(IS_DEV, plugins.sourcemaps.init()))
        .pipe(plugins.less()).on('error', util.log)
        .pipe(plugins.rename('app.min.css'))
        // .pipe(plugins.cssnano())
        .pipe(gulpIf(IS_DEV, plugins.sourcemaps.write()))
        .pipe(gulp.dest('dist/css'))
        .pipe(sync.stream());
});

gulp.task('styles:lib', function() {
    return gulp.src(paths.bootstrapCSS)
        .pipe(gulp.dest(paths.distBootstrapCss))
});

gulp.task('image', function () {
    gulp.src(paths.srcIMG)
        .pipe(plugins.image())
        .pipe(gulp.dest(paths.distIMG));
});

gulp.task("copy-lib", function () {
        return gulp.src(paths.lib)
            .pipe(gulp.dest(paths.distLib));
    }
);

gulp.task('fonts', function() {
    return gulp.src(paths.srcFonts)
        .pipe(gulp.dest(paths.distFonts));
});

gulp.task('fonts-bootstrap', function() {
    return gulp.src(paths.bootstrapFonts)
        .pipe(gulp.dest(paths.distBootstrapFonts));
});

gulp.task('clean', function(cb){
    setTimeout(function() {
        del.sync('dist');
        cb();
    }, 2000);
});

gulp.task('build', ['clean'], function() {
    gulp.start(['html', 'styles:app', 'styles:lib', 'image', 'fonts', 'fonts-bootstrap', 'copy-lib']);
});

gulp.task('watch', ['html', 'styles:app'], function() {
    sync.init({
        server: 'dist'
    });

    gulp.watch('src/styles/*.less', ['styles:app']);
    gulp.watch('src/index.html', ['html']);
    gulp.watch('dist/index.html').on('change', sync.reload);
});


gulp.task('default', ['watch']);