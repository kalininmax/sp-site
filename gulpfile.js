const gulp = require('gulp');
const svgSprite = require('./gulp-tasks/svg-sprite');
const watch = require('./gulp-tasks/watch')

gulp.task('svgSprite', svgSprite);
gulp.task('watch', watch);
