module.exports = {
	eleventyComputed: {
		permalink: (data) => {
			const subPath = data.page.filePathStem.replace('/pages/', '');

			if (subPath.endsWith('index')) {
				return `/${subPath}.html`;
			}
			return `/${subPath}/`;
		},
	},
};
