const { optimize, loadConfig } = require('svgo');
const pluginIcons = require('eleventy-plugin-icons');

const optimizeWithSVGO = async (content, configPath) => {
	const config = await loadConfig(configPath);
	const { data } = await optimize(content, config);

	return data;
};

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	config.addPlugin(pluginIcons, {
		mode: 'sprite',
		sources: [{ name: 'custom', path: './src/assets/svg/', default: true }],
		icon: {
			shortcode: 'icon',
			transform: (svg) => optimizeWithSVGO(svg, './svgo.config.js'),
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
