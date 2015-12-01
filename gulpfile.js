var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    jscs = require("gulp-jscs"),
    access = require('gulp-accessibility');

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

gulp.task('default', function() {
  gulp.watch('./js/*.js', ['lint', 'uglify']);
  gulp.watch('./*.html', ['access']);
});
