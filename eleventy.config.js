const yaml = require('js-yaml');
const htmlPrettifier = require('html-prettify');
const eleventySass = require('eleventy-sass');
const postcss = require('postcss');
const postcssMediaMinmax = require('postcss-media-minmax');
const autoprefixer = require('autoprefixer');
const postcssCsso = require('postcss-csso');
const esbuild = require('esbuild');
const Image = require('@11ty/eleventy-img');
const pluginIcons = require('eleventy-plugin-icons');

const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';

module.exports = config => {
	config.ignores.add('src/components');

	config.addShortcode('image', async function(src, sizes = '100vw', alt = '') {
		const originalFormat = src.split('.').pop();

		const metadata = await Image(`src/assets/images/${src}`, {
			widths: [640, 960, 1280, 1920, 2560],
			formats: ['avif', 'webp', originalFormat],
			urlPath: 'assets/images/',
			outputDir: 'build/assets/images/'
		});

		const imageAttr = {
			alt,
			sizes,
			loading: 'lazy',
			decoding: 'async',
		};

		return Image.generateHTML(metadata, imageAttr);
	})

	config.addDataExtension('yml', content => yaml.load(content));

	// HTML
	config.addTransform('html-prettify', (content, path) => {
		if (path && path.endsWith('.html')) {
			return htmlPrettifier(content);
		}

		return content;
	});

	// SCSS
	const postcssPlugins = [
		postcssMediaMinmax,
		autoprefixer,
		isProd && postcssCsso,
	].filter((value) => value);

	config.addPlugin(eleventySass, {
		sass: {
			loadPaths: ['node_modules'],
      sourceMap: isDev,
    },
		postcss: postcss(postcssPlugins)
	});

	// JS

	config.addTemplateFormats('js');
	config.addExtension('js', {
		outputFileExtension: 'js',
		compile: async (content, path) => {
			if (path !== './src/assets/scripts/index.js') {
				return;
			}

			return async () => {
				let output = await esbuild.build({
					target: 'es2020',
					entryPoints: [path],
					minify: isProd,
					bundle: true,
					write: false,
					sourcemap: isDev,
				});

				return output.outputFiles[0].text;
			}
		}
	});


	// Passthrough copy
	[
		'src/assets/fonts',
	].forEach(
		path => config.addPassthroughCopy(path)
	);

	// Dev Server
	config.setServerOptions({
		watch: ['build/assets/images/svg/sprite.svg']
	});

	config.addPlugin(pluginIcons, {
		mode: 'sprite',
		sources: { icons: 'src/assets/images/svg/' },
		default: 'icons',
		optimize: true,
		icon: {
				shortcode: 'icon',
		},
		sprites: {
				shortcode: 'spriteSheet',
				generateFile: 'assets/images/svg/sprite.svg',
				insertAll: true,
		}
	});

	// Config
	return {
		dir: {
			input: 'src',
			includes: 'includes',
			layouts: 'templates',
			data: 'data',
			output: 'build'
		}
	};
}
