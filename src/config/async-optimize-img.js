const getImgHTML = require('./img-shortcode.config');
const getPictureHTML = require('./picture-shortcode.config');

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	config.addTransform('async-optimize-img', async (content, outputPath) => {
		if (!outputPath || !outputPath.endsWith('.html')) {
			return content;
		}

		// Find all relevant placeholders on the page
		const imgPlaceholders = content.match(/<!-- IMG {[^}]+} -->/g) || [];
		const picturePlaceholders =
			content.match(/<!-- PICTURE {[^}]+} -->/g) || [];

		const promises = [...imgPlaceholders, ...picturePlaceholders].map(
			async (placeholder) => {
				// Extract structured data properties
				const propertiesString = placeholder.match(/{[^}]+}/);
				const isImg = placeholder.includes('IMG');
				const isPicture = placeholder.includes('PICTURE');

				if (isImg) {
					const html = await getImgHTML(propertiesString);
					content = content.replace(placeholder, html);
				}

				if (isPicture) {
					const html = await getPictureHTML(propertiesString);
					content = content.replace(placeholder, html);
				}
			}
		);

		await Promise.all(promises);
		return content;
	});
};
