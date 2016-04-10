var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssbeautify = require('gulp-cssbeautify');

function sassIt(src, dest) {
  gulp.src(src)
    .pipe(sass()).on('error', sass.logError)
    .pipe(cssbeautify({
      indent: '  ',
      autosemicolon: true
    }))
    .pipe(gulp.dest(dest));
}

gulp.task('sass', () => {
  sassIt('./sass/test.scss', './css');
});

gulp.task('sitesass', () => {
  sassIt('./src/**/*.scss', './src');
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'sass:watch']);
