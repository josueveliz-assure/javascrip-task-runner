import gulp from 'gulp';
import browserSync from 'browser-sync';
import * as sass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import inject from 'gulp-inject';

const sassCompiler = gulpSass(sass)
const reload = browserSync.reload;

gulp.task('sass', () => {
  return gulp.src('./css/sass/**/*.scss')
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(gulp.dest('./css'))
    // .pipe(reload({ stream: true }));
    .pipe(browserSync.stream());
});

gulp.task('serve', gulp.series('sass', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });

  gulp.watch('./css/sass/**/*.scss', gulp.series('sass'));
  gulp.watch(['index.html', './css/**/*.css', './js/**/*.js']).on('change', reload);
}));

gulp.task('serveBuild', gulp.series('sass', () => {
    browserSync.init({
      server: {
        baseDir: 'dist/',
      },
    });
}));


gulp.task('default', gulp.series('serve'));

gulp.task('styles', () => {
  return gulp.src('./css/sass/**/*.scss')
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp.src(['./js/**/*.js'])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src('./img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('inject', gulp.series('styles', 'scripts', 'images', () => {
  const target = gulp.src('./index.html');
  const sources = gulp.src(['dist/css/*.css', 'dist/js/*.js'], { read: false });

  return target.pipe(inject(sources, { relative: true, ignorePath: 'dist/' }))
    .pipe(gulp.dest('./dist'));
}));

gulp.task('build', gulp.series('inject', 'serveBuild', () => {
  gulp.watch(['./index.html', './css/sass/**/*.scss', './js/**/*.js', './img/**/*'], gulp.series('inject')).on('build', reload);
}));
