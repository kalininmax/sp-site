const nodePath = require('path');
const prettier = require('prettier');

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	config.addTransform('prettier', (content, outputPath) => {
		const extname = nodePath.extname(outputPath);

		if (extname === '.html' || extname === '.json') {
			return prettier.format(content, {
				parser: extname.replace(/^./, ''),
				useTabs: true,
			});
		}

		return content;
	});
};
