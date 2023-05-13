const Image = require('@11ty/eleventy-img');

module.exports = (src, cls = '', sizes = '100vw', alt = '', loading = 'lazy', decoding = 'async') => {
	const originalFormat = src.match(/\.\w*$/)[0].substring(1);
	const subfolder = src.match(/^.*\//);
	const subfolderPath = subfolder ? subfolder[0] : '';
	const imgPath = `src/assets/images/${src}`;

	const options = {
		widths: [640, 960, 1280, 1920, 2560],
		formats: ['avif', 'webp', originalFormat],
		urlPath: 'assets/images/' + subfolderPath,
		outputDir: 'build/assets/images/' + subfolderPath,
	};

	Image(imgPath, options);

	const imageAttr = {
		class: cls,
		alt,
		sizes,
		loading,
		decoding,
	};

	const metadata = Image.statsSync(imgPath, options);

	return Image.generateHTML(metadata, imageAttr);
};
