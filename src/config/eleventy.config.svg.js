const pluginIcons = require('eleventy-plugin-icons');

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	config.addPlugin(pluginIcons, {
		mode: 'sprite',
		sources: [{ name: 'custom', path: './src/assets/svg/', default: true }],
		icon: {
			shortcode: 'icon',
		},
		sprite: {
			shortcode: 'svgSprite',
			writeFile: 'assets/svg/sprite.svg',
			extraIcons: { all: true, sources: ['custom'] },
			attributes: {
				class: 'svg-sprite',
				'aria-hidden': true,
			},
		},
	});
};
