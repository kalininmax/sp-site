const nodePath = require('path');
const fs = require('fs');
const sass = require('sass');
const postcss = require('postcss');
const postcssMediaMinmax = require('postcss-media-minmax');
const autoprefixer = require('autoprefixer');
const postcssCsso = require('postcss-csso');
const postcssAssets = require('postcss-assets');

const isDev = process.env.ELEVENTY_ENV === 'development';
const isProd = process.env.ELEVENTY_ENV === 'production';

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = (config) => {
	const postcssPlugins = [
		postcssMediaMinmax,
		autoprefixer,
		postcssAssets({ loadPaths: ['src/assets/images/inline'], cache: true }),
		isProd && postcssCsso,
	].filter(Boolean);

	config.addTemplateFormats('scss');
	config.addExtension('scss', {
		outputFileExtension: 'css',
		compile: async function (inputContent, inputPath) {
			const parsed = nodePath.parse(inputPath);

			if (parsed.name.startsWith('_')) {
				return;
			}

			const dirname = 'build/assets/styles/';
			const filename = `${parsed.name}.css.map`;

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
						output.map.toString(),
					);

					output.css += `\n/*# sourceMappingURL=${filename} */`;
				}

				return output.css;
			};
		},
	});
};
