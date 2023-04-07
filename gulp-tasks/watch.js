const gulpWatch = require('gulp-watch');

const svgSprite = require('./svg-sprite');

module.exports = function watch() {
	gulpWatch(['src/assets/images/svg/**/*.svg'], svgSprite);
};
