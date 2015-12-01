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

gulp.task('lint', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('uglify', function() {
    gulp.src(['./js/*.js', '!./js/*.min.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
          extname: '.min.js'
        }))
        .pipe(gulp.dest('./js'));
});

gulp.task('jscs', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js'])
      .pipe(jscs({fix: true}))
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(gulp.dest('./js'));
});

gulp.task('access', function() {
  return gulp.src('./*.html')
    .pipe(access(
      {
        accessibilityLevel: 'WCAG2AAA'
      }
    ));
});

gulp.task('htmlhint', function() {
  return gulp.src("./*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
});

gulp.task('sass', function () {
  gulp.src('./sass/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('csslint', function () {
  return gulp.src(['./css/main.css', './css/normalise.css'])
    .pipe(csslint())
    .pipe(csslint.reporter())
});

gulp.task('concatandminfiycss', function () {
  return gulp.src(['./css/main.css', './css/normalise.css'])
    .pipe(concatcss('bundle.css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('default', function() {
  gulp.watch('./js/*.js', ['lint', 'uglify']);
  gulp.watch('./*.html', ['access', 'htmlhint']);
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch(['./css/main.css', './css/normalise.css', '!./css/style.css'], ['csslint', 'concatandminfiycss']);
});
