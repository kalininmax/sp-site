const yaml = require('js-yaml');
const htmlPrettifier = require('html-prettify');
const eleventySass = require('eleventy-sass');
const postcss = require('postcss');
const postcssMediaMinmax = require('postcss-media-minmax');
const autoprefixer = require('autoprefixer');
const postcssCsso = require('postcss-csso');
const postcssAssets = require('postcss-assets');
const esbuild = require('esbuild');
const pluginIcons = require('eleventy-plugin-icons');

const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';

const shortcodes = require('./src/shortcodes');

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	config.ignores.add('src/components');

	Object.keys(shortcodes).forEach((name) => {
		config.addShortcode(name, shortcodes[name]);
	});

	config.addDataExtension('yml', (content) => yaml.load(content));

	// ======= HTML =======
	config.addTransform('html-prettify', (content, path) => {
		if (path && path.endsWith('.html')) {
			return htmlPrettifier(content);
		}

		return content;
	});

	// ======= SCSS =======
	const postcssPlugins = [
		postcssMediaMinmax,
		autoprefixer,
		postcssAssets({ loadPaths: ['src/assets/images/inline'], cache: true }),
		isProd && postcssCsso,
	].filter((value) => value);
	config.addPlugin(eleventySass, {
		sass: {
			loadPaths: ['node_modules'],
			sourceMap: isDev,
		},
		postcss: postcss(postcssPlugins),
	});

	// ======= JS =======
	config.addTemplateFormats('js');
	config.addExtension('js', {
		outputFileExtension: 'js',
		compile: async (_, path) => {
			if (path !== './src/assets/scripts/index.js') {
				return;
			}

			return async () => {
				const output = await esbuild.build({
					target: 'es2020',
					entryPoints: [path],
					minify: isProd,
					bundle: true,
					write: false,
					sourcemap: true,
				});

				return output.outputFiles[0].text;
			};
		},
	});

	// ======= COPY =======
	['src/assets/fonts'].forEach((path) => config.addPassthroughCopy(path));

	// ======= DEV SERVER =======
	// config.setServerOptions({
	// 	watch: ['build/assets/images/svg/sprite.svg'],
	// });

	// ======= SVG SPRITE =======
	config.addPlugin(pluginIcons, {
		mode: 'sprite',
		sources: { icons: 'src/assets/images/svg/' },
		default: 'icons',
		optimize: true,
		icon: {
			shortcode: 'icon',
		},
		sprites: {
			shortcode: 'svgSprite',
			generateFile: 'assets/images/svg/sprite.svg',
			insertAll: true,
		},
	});

	return {
		dir: {
			input: 'src',
			includes: 'includes',
			layouts: 'templates',
			data: 'data',
			output: 'build',
		},
	};
};
