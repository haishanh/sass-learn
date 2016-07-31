const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
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

gulp.task('res', () => {
  return gulp.src(['./src/**/*.js', './src/CNAME'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('sitesass', () => {
  gulp.src('./src/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    })).on('error', sass.logError)
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./sass/**/*.scss', ['sass'])
  gulp.watch('./src/**/*.scss', ['sitesass']);
});

gulp.task('dist', ['sitesass', 'res']);

gulp.task('default', ['sass', 'sass:watch']);
