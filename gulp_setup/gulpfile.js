const argv = require('yargs').argv;
const PRODUCTION = argv.prod;
const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const { series } = require('gulp');
const { parallel } = require('gulp');
const webpack = require('webpack-stream');


function css() {
  return src('./src/assets/sass/**/*.scss', { sourcemaps: true })
      .pipe(sass())
      .pipe(minifyCSS())
      .pipe(dest('./'), { sourcemaps: true })
      .pipe(browserSync.stream());
}

function js() {
  return src('./src/assets/js/*.js', { sourcemaps: true })
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('build.min.js'))
      .pipe(dest('./dist/assets/js/min/', { sourcemaps: true }));
}

function minimage() {
  return src('./src/assets/img/*')
  .pipe(imagemin())
  .pipe(dest('./dist/assets/img'))
}

function browser() {
  browserSync.init({
      proxy: {
        target: 'sandbox.local',
        ws: true
      },
      files: [
        './**/*.php'
    ],
  ghostMode: true,
  https: false,
  watchOptions: {
  debounceDelay: 1000 // This introduces a small delay when watching for file change events to avoid triggering too many reloads
  }
  });

  watch('./src/assets/sass/**/*.scss', css);
  watch('./src/assets/js/*.js', js).on('change', browserSync.reload);
}

function clean(cb) {
  // body omitted
  cb();
}



exports.css = css;
exports.js = js;
exports.browser = browser;
exports.minimage = minimage;

exports.dev = series(clean, parallel(css,js,minimage), browser);