const yaml = require('js-yaml');

const shortcodes = require('./src/shortcodes');
const PATHS = require('./paths');

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	config.ignores.add('src/components');

	Object.keys(shortcodes).forEach((name) =>
		config.addShortcode(name, shortcodes[name])
	);

	config.addFilter('debug', (...args) => console.log(...args));

	config.addDataExtension('yml', (content) => yaml.load(content));

	config.addPlugin(require('./src/config/eleventy.config.styles'));
	config.addPlugin(require('./src/config/eleventy.config.scripts'));
	config.addPlugin(require('./src/config/eleventy.config.formatter'));
	config.addPlugin(require('./src/config/eleventy.config.svg'));
	config.addPlugin(require('./src/config/async-optimize-img'));

	config.addGlobalData('env', require('dotenv').config().parsed);

	PATHS.src.copy.forEach((path) => config.addPassthroughCopy(path));

	return {
		dir: {
			input: PATHS.src.root,
			includes: PATHS.src.includes,
			layouts: PATHS.src.layouts,
			data: PATHS.src.data,
			output: PATHS.build.root,
		},
	};
};
