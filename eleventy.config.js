const nodePath = require('path');
const fs = require('fs');
const sass = require('sass');
const yaml = require('js-yaml');
const prettier = require('prettier');
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

	config.addFilter('debug', (...args) => {
		console.log(...args);
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

	config.addTemplateFormats('scss');
	config.addExtension('scss', {
		outputFileExtension: 'css',
		compile: async function (inputContent, inputPath) {
			const parsed = nodePath.parse(inputPath);

			if (parsed.name.startsWith('_')) {
				return;
			}

			const dirname = 'build/assets/styles/';
			const filename = parsed.name + '.css.map';

			const result = sass.compileString(inputContent, {
				loadPaths: [parsed.dir || '.', 'node_modules'],
				sourceMap: isDev,
			});

			this.addDependencies(inputPath, result.loadedUrls);

			// eslint-disable-next-line consistent-return
			return async () => {
				const output = await postcss(postcssPlugins).process(result.css, {
					from: inputPath,
					map: isDev && { prev: result.sourceMap },
				});

				isDev && output.map.toJSON();

				if (isDev && output.map) {
					fs.mkdirSync(dirname, { recursive: true });
					fs.writeFileSync(
						nodePath.join(dirname, filename),
						output.map.toString()
					);

					output.css += `\n/*# sourceMappingURL=${filename} */`;
				}

				return output.css;
			};
		},
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
	['src/assets/fonts', 'src/assets/images', 'src/assets/favicons'].forEach(
		(path) => config.addPassthroughCopy(path)
	);

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
			insertAttributes: {
				class: 'svg-sprite',
				'aria-hidden': true,
			},
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
