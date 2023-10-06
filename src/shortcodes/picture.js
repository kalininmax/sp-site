const Image = require('@11ty/eleventy-img');
const PATHS = require('../../paths');

module.exports = (
	src,
	cls,
	clsImg,
	attr,
	widths = [640, 960, 1280, 1920, 2560],
	sizes = '100vw',
	formats = ['webp'],
	alt = '',
	loading = 'lazy',
	decoding = 'async'
) => {
	let originalFormat = src.match(/\.\w*$/)[0].substring(1);
	originalFormat = originalFormat === 'jpg' ? 'jpeg' : originalFormat;

	const subfolder = src.match(/^.*\//);
	const subfolderPath = subfolder ? subfolder[0] : '';
	const imgPath = PATHS.src.images + src;

	const options = {
		widths: widths,
		formats: [...formats, originalFormat],
		urlPath: '/assets/images/' + subfolderPath,
		outputDir: PATHS.build.images + subfolderPath,
		sharpWebpOptions: { quality: 90 },
		sharpAvifOptions: { quality: 90 },
	};

	Image(imgPath, options);

	const metadata = Image.statsSync(imgPath, options);

	const lowsrc = metadata[originalFormat][0];
	const highsrc = metadata[originalFormat][metadata[originalFormat].length - 1];

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
