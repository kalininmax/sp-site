const path = require('path');
const gulp = require('gulp');
const rename = require('gulp-rename');
const svgSprite = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const editSVG = require('gulp-cheerio');

const svgoPluginsList = [
	'removeDoctype',
	'removeXMLProcInst',
	'removeComments',
	'removeMetadata',
	'removeEditorsNSData',
	'cleanupAttrs',
	'mergeStyles',
	'inlineStyles',
	'minifyStyles',
	'removeUselessDefs',
	'cleanupNumericValues',
	'convertColors',
	'removeUnknownsAndDefaults',
	'removeNonInheritableGroupAttrs',
	'removeUselessStrokeAndFill',
	'removeViewBox',
	'cleanupEnableBackground',
	'removeHiddenElems',
	'removeEmptyText',
	'convertShapeToPath',
	'convertEllipseToCircle',
	'moveElemsAttrsToGroup',
	'moveGroupAttrsToElems',
	'collapseGroups',
	'convertPathData',
	'convertTransform',
	'removeEmptyAttrs',
	'removeEmptyContainers',
	'mergePaths',
	'removeUnusedNS',
	'sortDefsChildren',
	'removeTitle',
	'removeDesc',
	'removeStyleElement',
	'convertStyleToAttrs'
];

module.exports = function svg() {
	return gulp
		.src('src/assets/images/svg/**/*.svg')
		.pipe(svgmin(file => {
			const prefix = path.basename(file.relative, path.extname(file.relative));

			return {
				multipass: true,
				full: true,
				plugins: [
					...svgoPluginsList,
					{
						name: 'cleanupIDs',
						params: {
							prefix: `${prefix}-`,
							minify: true
						}
					},
				]
			}
		}))
		.pipe(rename({ prefix: 'icon-' }))
		.pipe(svgSprite({ inlineSvg: true }))
		.pipe(editSVG({
			run: $ => {
				$('svg').attr('style', 'display:none');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('build/assets/images/svg/'));
};
