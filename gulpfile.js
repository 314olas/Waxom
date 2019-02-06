'use strict';

const gulp  = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autopreffixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');


const options = {
    default_js_file:'index.js',
    scripts:{
        src: './src/js/',
        dest:'./dist/js',
        watch: './src/js/**/*.js'
    },
    styles:{
        src: './src/sass/*.scss',
        dest:'./dist/css',
        watch: './src/sass/**/*.scss'
    }
};

gulp.task('watch', () => {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(options.scripts.watch, ['js']);
    gulp.watch(options.default_js_file, ['js']);
    gulp.watch(options.styles.watch, ['sass']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);

});

gulp.task('sass', () => {
    return gulp.src(options.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autopreffixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(options.styles.dest))
        .pipe(browserSync.stream());
});

gulp.task('mincss', ['sass'], () => {
    return gulp.src("dist/css/**.css")
        .pipe(rename({suffix: ".min"}))
        .pipe(cleanCSS())
        .pipe(gulp.dest("dist"));
});

gulp.task('js', () => {
    return browserify({
        extensions: ['.js'],
        entries: [options.default_js_file],
        debug: true
    })
    .transform('babelify', {
        presets: ['env']
    })
    .bundle()
    .pipe(source(options.scripts.src))
    .pipe(buffer())
    .pipe(rename({
        dirname: "",
        basename: "index",
        suffix: ".js"
    }))
    .pipe(gulp.dest(options.scripts.dest))
    .pipe(browserSync.stream());
});

gulp.task('dev', ['watch']);
gulp.task('prod', ['mincss']);