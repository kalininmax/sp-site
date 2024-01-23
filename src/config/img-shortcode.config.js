const Image = require('@11ty/eleventy-img');
const PATHS = require('../../paths');

module.exports = async (props) => {
	let { src } = JSON.parse(props);
	const {
		cls,
		attr,
		widths = [640, 1280, 1920, 2560],
		sizes = '100vw',
		format = 'webp',
		alt = '',
		loading = 'lazy',
		decoding = 'async',
	} = JSON.parse(props);

	if (!src.startsWith('http')) {
		src = 'src/assets/images/' + src;
	}

	const options = {
		widths: widths,
		formats: format,
		urlPath: '/assets/images/',
		outputDir: PATHS.build.images,
		sharpWebpOptions: { quality: 90 },
	};

	const metadata = await Image(src, options);

	const lowsrc = metadata[format][0];
	const highsrc = metadata[format][metadata[format].length - 1];

	const imgClassName = cls ? ` class="${cls}"` : '';
	const imgAttr = attr ? ` ${attr}` : '';

	const srcSet = Object.values(metadata)
		.map((img) => `${img.map((entry) => entry.srcset).join(', ')}`)
		.join();

	return `<img${imgClassName} src="${lowsrc.url}" srcset="${srcSet}" sizes="${sizes}" width="${highsrc.width}" height="${highsrc.height}" alt="${alt}" loading="${loading}" decoding="${decoding}"${imgAttr}>`;
};
