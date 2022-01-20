const {src,dest,watch,series} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const minifyCss = require('gulp-csso');
const minifyImg = require('gulp-imagemin');
const minifyJs = require('gulp-uglify');
const concat = require('gulp-concat');

// browserSync
function browserSyncServe(cb) {
    browserSync.init({
        proxy: 'http://127.0.0.1:5500/dist/html/index.html'
    });
    cb();
}

function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

// css
function cssTask() {
    return src('src/sass/**/*.scss', {
            sourcemaps: true
        })
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(concat('app.min.css'))
        .pipe(dest('dist/css', {
            sourcemaps: ''
        }))
}

// js
function jsTask() {
    return src('src/js/**/*.js', {
            sourcemaps: true
        })
        .pipe(minifyJs())
        .pipe(concat('app.min.js'))
        .pipe(dest('dist/js', {
            sourcemaps: ''
        }))
}

// html 
function htmlTask() {
    return src('src/html/**/*.html', {
            sourcemaps: true
        })
        .pipe(dest('dist/html', {
            sourcemaps: ''
        }))
}

// img
function imgTask() {
    return src('src/img/**/*', {
            sourcemaps: true
        })
        .pipe(minifyImg())
        .pipe(dest('dist/img', {
            sourcemaps: ''
        }))
}

// watch
function watchTask() {
    watch(['src/html/**/*.hmtl'], series(htmlTask, browserSyncReload));
    watch(['src/sass/**/*.scss', 'src/js/**/*.js', 'src/img/**/*'], series(cssTask, jsTask, imgTask, browserSyncReload));
}

exports.default = series(
    cssTask,
    jsTask,
    htmlTask,
    imgTask,
    browserSyncServe,
    watchTask
);