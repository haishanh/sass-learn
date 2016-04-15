const gulp = require('gulp'),
      sass = require('gulp-sass');

function sassIt(src, dest) {
  gulp.src(src)
    .pipe(sass({
      outputStyle: 'expanded'
    })).on('error', sass.logError)
    .pipe(gulp.dest(dest));
}

gulp.task('sass', () => {
  sassIt('./sass/content.scss', './css');
});

gulp.task('sitesass', () => {
  sassIt('./src/**/*.scss', './src');
});

gulp.task('sass:watch', () => {
  gulp.watch('./sass/**/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'sass:watch']);
