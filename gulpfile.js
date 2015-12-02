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

// HTML

// hint
gulp.task('html:hint', function() {
  return gulp.src('./*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
});

// accessibility
gulp.task('html:accessibility', function() {
  return gulp.src('./*.html')
    .pipe(
      access({accessibilityLevel: 'WCAG2AAA'})
    );
});

// CSS

// lint
gulp.task('css:lint', function () {
  return gulp.src(['./css/main.css', '!./css/h5bp.css', '!./css/src/normalize.css'])
    .pipe(csslint())
    .pipe(csslint.reporter())
});

// concat and minify
gulp.task('css:concatandminify', function () {
  return gulp.src(['./css/*.css'])
    .pipe(concatcss('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./css'));
});

// Sass

gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./css'));
});

// JavaScript

// lint
gulp.task('js:lint', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// jscs
gulp.task('js:jscs', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
    // .pipe(jscs({fix: true}))
    .pipe(jscs())
    .pipe(jscs.reporter());
    // .pipe(gulp.dest('./js'))
});

// uglify
gulp.task('js:uglify', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./js'));
});

// lint all the things
gulp.task('lint', function() {
  gulp.watch('./*.html', ['html:hint', 'html:accessibility']);
  gulp.watch(['./css/*.css'], ['css:lint']);
  gulp.watch('./js/*.js', ['js:lint', 'js:jscs']);
});

// build all the things
gulp.task('build', ['css:concatandminify', 'sass', 'js:uglify']);
