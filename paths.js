const buildFolder =
	process.env.ELEVENTY_ENV === 'production' ? 'build-production' : 'build';

module.exports = {
	build: {
		root: buildFolder,
		images: `${buildFolder}/assets/images/`,
	},
	src: {
		root: 'src',
		includes: 'includes',
		layouts: 'templates',
		data: 'data',
		images: 'src/assets/images/',
		copy: [
			'src/assets/fonts',
			'src/assets/images',
			{ 'src/assets/favicons': '/' },
			{ 'src/assets/robots': '/' },
		],
	},
};
