var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssbeautify = require('gulp-cssbeautify');

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass()).on('error', sass.logError)
    .pipe(cssbeautify({
      indent: '  ',
      autosemicolon: true
    }))
    .pipe(gulp.dest('./css'));;
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'sass:watch']);
