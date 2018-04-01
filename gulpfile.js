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
    srcJS             : 'src/scripts/main.js',
    srcIMG            : 'src/img/**/*',
    srcFonts          : 'src/fonts/**/*',
    srcData           : 'src/data/*',
    dist              : 'dist',
    distIndex         : 'dist/index.html',
    distCSS           : 'dist/css/',
    distJS            : 'dist/js',
    distIMG           : 'dist/img/',
    distFonts         : 'dist/fonts/',
    distData          : 'dist/data',
    bootstrapCSS      : "./node_modules/bootstrap/dist/css/bootstrap.min.css",
    libFonts          : "./node_modules/bootstrap/dist/fonts/*",
    libCSS            : [
        "./node_modules/bootstrap/dist/css/bootstrap.css",
        "./node_modules/owl.carousel/dist/assets/owl.carousel.css"
    ],
    libJS : [
        "./node_modules/jquery/dist/jquery.js",
        "./node_modules/bootstrap/dist/js/bootstrap.js",
        "./node_modules/owl.carousel/dist/owl.carousel.js"
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
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer("last 2 versions"))
        .pipe(plugins.cssnano())
        .pipe(plugins.rename('app.min.css'))
        .pipe(gulpIf(IS_DEV, plugins.sourcemaps.write()))
        .pipe(gulp.dest(paths.distCSS))
        .pipe(sync.stream());
});

gulp.task("styles:vendor", function () {
    return gulp.src(paths.libCSS)
        .pipe(gulpIf(!IS_DEV, plugins.cssnano()))
        .pipe(plugins.concat("vendor.css"))
        .pipe(gulp.dest(paths.distCSS));
});

gulp.task('scripts:app', function() {
    return gulp.src(paths.srcJS)
         .pipe(gulpIf(IS_DEV, plugins.sourcemaps.init()))
         // .pipe(plugins.uglify())
         .pipe(gulpIf(IS_DEV, plugins.sourcemaps.write()))
         .pipe(gulp.dest(paths.distJS));

});

gulp.task("scripts:vendor", function () {
    return gulp.src(paths.libJS)
        .pipe(plugins.concat("vendor.js"))
        .pipe(gulpIf(!IS_DEV, plugins.uglify()))
        .pipe(gulp.dest(paths.distJS));
});

gulp.task('image', function () {
    return gulp.src(paths.srcIMG)
        // .pipe(plugins.image())
        .pipe(gulp.dest(paths.distIMG));
});

gulp.task('fonts', function() {
    return gulp.src([paths.srcFonts, paths.libFonts])
        .pipe(gulp.dest(paths.distFonts));
});

gulp.task('data', function() {
    return gulp.src(paths.srcData)
        .pipe(gulp.dest(paths.distData));
});

gulp.task("styles", ["styles:app", "styles:vendor"]);
gulp.task("scripts", ["scripts:app", "scripts:vendor"]);

gulp.task('clean', function(cb){
    setTimeout(function() {
        del.sync('dist');
        cb();
    }, 2000);
});

gulp.task('build', ['clean'], function() {
    gulp.start(['html', 'styles', 'scripts', 'image', 'fonts', 'data']);
});

gulp.task('watch', ['build'], function() {
    sync.init({
        server: 'dist'
    });

    gulp.watch('src/styles/*.less', ['styles:app']);
    gulp.watch('src/styles/*.less', ['styles:app']).on("change", sync.reload);

    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.html', ['html']).on("change", sync.reload);

    gulp.watch('src/scripts/main.js', ['scripts:app']);
    gulp.watch('src/scripts/main.js', ['scripts:app']).on("change", sync.reload);

    gulp.watch('dist/index.html').on('change', sync.reload);
});


gulp.task('default', ['watch']);