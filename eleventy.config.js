const nodePath = require('path');
const yaml = require('js-yaml');
const prettier = require('prettier');
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

	// ======= PRETTIER =======
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
			style: isDev ? 'expanded' : 'compressed',
		},
		postcss: postcss(postcssPlugins),
	});

	// ======= JS =======
	config.addTemplateFormats('js');
	config.addExtension('js', {
		outputFileExtension: 'js',
		compile: async () => async () => {
			await esbuild.build({
				target: 'es2020',
				entryPoints: ['./src/assets/scripts/index.js'],
				minify: isProd,
				bundle: true,
				write: true,
				sourcemap: true,
				outbase: 'src/',
				outdir: 'build/',
			});
		},
	});

	// ======= COPY =======
	['src/assets/fonts'].forEach((path) => config.addPassthroughCopy(path));

	// ======= SVG SPRITE =======
	config.addPlugin(pluginIcons, {
		mode: 'sprite',
		sources: { icons: 'src/assets/svg/' },
		default: 'icons',
		optimize: true,
		icon: {
			shortcode: 'icon',
		},
		sprites: {
			shortcode: 'svgSprite',
			generateFile: 'assets/svg/sprite.svg',
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
