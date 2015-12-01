var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    jscs = require("gulp-jscs"),
    access = require('gulp-accessibility'),
    htmlhint = require("gulp-htmlhint"),
    sass = require('gulp-sass'),
    csslint = require('gulp-csslint'),
    minifycss = require('gulp-minify-css'),
    concatcss = require('gulp-concat-css');

// HTML

gulp.task('html:hint', function() {
  return gulp.src("./*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
});

gulp.task('html:accessibility', function() {
  return gulp.src('./*.html')
    .pipe(
      access({accessibilityLevel: 'WCAG2AAA'})
    );
});

gulp.task('html', ['html:hint', 'html:accessibility']);

// CSS

gulp.task('css:lint', function () {
  return gulp.src(['./css/main.css', './css/normalise.css'])
    .pipe(csslint())
    .pipe(csslint.reporter())
});

gulp.task('css:concatandminify', function () {
  return gulp.src(['./css/main.css', './css/normalise.css'])
    .pipe(concatcss('bundle.css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

// Sass

gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

// JavaScript

gulp.task('js:lint', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js:jscs', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
    // .pipe(jscs({fix: true}))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(gulp.dest('./js'));
});

gulp.task('js:uglify', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./js'));
});

gulp.task('js', ['js:lint', 'js:jscs']);

// gulp all the things

gulp.task('default', function() {
  gulp.watch('./*.html', ['html']);
  gulp.watch(['./css/main.css', './css/normalise.css'], ['css:lint']);
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch('./js/*.js', ['js:lint', 'js:jscs']);
});
