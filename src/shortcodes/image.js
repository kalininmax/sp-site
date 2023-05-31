const Image = require('@11ty/eleventy-img');

module.exports = (
	src,
	cls,
	clsImg,
	attr,
	sizes = '100vw',
	alt = '',
	loading = 'lazy',
	decoding = 'async'
) => {
	const originalFormat = src.match(/\.\w*$/)[0].substring(1);
	const subfolder = src.match(/^.*\//);
	const subfolderPath = subfolder ? subfolder[0] : '';
	const imgPath = `src/assets/images/${src}`;

	const options = {
		widths: [640, 960, 1280, 1920, 2560],
		formats: ['avif', 'webp', originalFormat],
		urlPath: 'assets/images/' + subfolderPath,
		outputDir: 'build/assets/images/' + subfolderPath,
		sharpWebpOptions: { quality: 90 },
		sharpAvifOptions: { quality: 90 },
	};

	Image(imgPath, options);

	const metadata = Image.statsSync(imgPath, options);

	const lowsrc = metadata.jpeg[0];
	const highsrc = metadata.jpeg[metadata.jpeg.length - 1];

	const pictureClassName = cls ? ` class="${cls}"` : '';
	const imgClassName = clsImg ? ` class="${clsImg}"` : '';
	const pictureAttr = attr ? ` ${attr}` : '';

	return `<picture${pictureClassName}${pictureAttr}>
			${Object.values(metadata)
				.map(
					(imageFormat) =>
						`	<source type="${imageFormat[0].sourceType}" srcset="${imageFormat
							.map((entry) => entry.srcset)
							.join(', ')}" sizes="${sizes}">`
				)
				.join('\n')}
				<img
					${imgClassName}
					src="${lowsrc.url}"
					width="${highsrc.width}"
					height="${highsrc.height}"
					alt="${alt}"
					loading="${loading}"
					decoding="${decoding}">
			</picture>`;
};
