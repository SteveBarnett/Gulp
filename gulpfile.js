var gulp = require('gulp'),
    htmlhint = require('gulp-htmlhint'),
    access = require('gulp-accessibility'),
    csslint = require('gulp-csslint'),
    concatcss = require('gulp-concat-css'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

var config = {
  cssdest: './css',
  jsdest: './js',
  html: './*.html',
  csslint: ['./css/*.css', '!./css/*.min.css', '!./css/h5bp.css', '!./css/normalize.css'],
  cssconcatandminify: ['./css/*.css', '!./css/*.min.css'],
  sass: './sass/*.scss',
  js: ['./js/*.js', '!./js/*.min.js'],
  cssdestname: 'style',
  jsdestname: 'main'
};

// HTML

// hint
gulp.task('html:hint', function() {
  return gulp.src(config.html)
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
});

// accessibility
gulp.task('html:accessibility', function() {
  return gulp.src('config.html')
    .pipe(
      access({accessibilityLevel: 'WCAG2AAA'})
    );
});

// CSS

// lint
gulp.task('css:lint', function () {
  return gulp.src(config.csslint)
    .pipe(csslint())
    .pipe(csslint.reporter())
});

// concat and minify
gulp.task('css:concatandminify', function () {
  return gulp.src(config.cssconcatandminify)
    .pipe(concatcss(cssdestname + '.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(config.cssdest));
});

// Sass

gulp.task('sass', function () {
  return gulp.src(config.sass)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(config.cssdest));
});

// JavaScript

// lint
gulp.task('js:lint', function() {
  return gulp.src(config.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// jscs
gulp.task('js:jscs', function() {
  return gulp.src(config.js)
    // .pipe(jscs({fix: true}))
    .pipe(jscs())
    .pipe(jscs.reporter());
    // .pipe(gulp.dest('./js'))
});

// uglify
gulp.task('js:uglify', function() {
  return gulp.src(config.js)
    .pipe(concat(jsdestname + '.js'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(config.jsdest));
});

// lint all the things
gulp.task('default',
  ['html:hint',
  'html:accessibility',
  'css:lint',
  'js:lint',
  'js:jscs'
]);

gulp.task('watch', function() {
  gulp.watch(config.html, ['html:hint', 'html:accessibility']);
  gulp.watch(config.csslint, ['css:lint']);
  gulp.watch(config.js, ['js:lint', 'js:jscs']);
});


// build all the things
gulp.task('build', ['css:concatandminify', 'sass', 'js:uglify']);
