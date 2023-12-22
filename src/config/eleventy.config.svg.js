const pluginIcons = require('eleventy-plugin-icons');

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	config.addPlugin(pluginIcons, {
		mode: 'sprite',
		sources: { icons: 'src/assets/svg/' },
		default: 'icons',
		optimize: true,
		icon: {
			shortcode: 'icon',
		},
		sprites: {
			generateFile: 'assets/svg/sprite.svg',
			insertAll: true,
		},
	});
};
