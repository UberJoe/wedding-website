'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var tailwindcss = require('@tailwindcss/postcss');
var autoprefixer = require('autoprefixer');

// Compile SCSS, process Tailwind, autoprefixer, and minify
gulp.task('sass', function () {
  return gulp.src('./sass/styles.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(postcss([tailwindcss(), autoprefixer()]))
    .pipe(rename({ basename: 'styles.min' }))
    .pipe(gulp.dest('./css'));
});

// Watch SCSS changes
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', gulp.series('sass'));
});

// minify js
gulp.task('minify-js', function () {
    return gulp.src('./js/scripts.js')
        .pipe(uglify())
        .pipe(rename({basename: 'scripts.min'}))
        .pipe(gulp.dest('./js'));
});

// default task
gulp.task('default', gulp.series('sass', 'minify-js'));