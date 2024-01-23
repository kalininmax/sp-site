const Image = require('@11ty/eleventy-img');
const PATHS = require('../../paths');

module.exports = async (props) => {
	let { src } = JSON.parse(props);
	const {
		cls,
		clsImg,
		attr,
		widths = [640, 1280, 1920, 2560],
		sizes = '100vw',
		formats = ['avif', 'webp'],
		alt = '',
		loading = 'lazy',
		decoding = 'async',
	} = JSON.parse(props);

	if (!src.startsWith('http')) {
		src = 'src/assets/images/' + src;
	}

	let originalFormat = src.match(/\.\w*$/)[0].substring(1);
	originalFormat = originalFormat === 'jpg' ? 'jpeg' : originalFormat;

	const options = {
		widths: widths,
		formats: [...formats, originalFormat],
		urlPath: '/assets/images/',
		outputDir: PATHS.build.images,
		sharpWebpOptions: { quality: 90 },
		sharpAvifOptions: { quality: 90 },
	};

	const metadata = await Image(src, options);

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
