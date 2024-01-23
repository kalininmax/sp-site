/* eslint-disable default-param-last */

module.exports = function (
	src,
	cls,
	attr,
	widths,
	sizes,
	format,
	alt,
	loading,
	decoding,
) {
	const properties = JSON.stringify({
		src,
		cls,
		attr,
		widths,
		sizes,
		format,
		alt,
		loading,
		decoding,
	});

	return `<!-- IMG ${properties} -->`;
};
