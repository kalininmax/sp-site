/* eslint-disable default-param-last */

module.exports = function (
	src,
	cls,
	clsImg,
	attr,
	widths,
	sizes,
	formats,
	alt,
	loading,
	decoding,
) {
	const properties = JSON.stringify({
		src,
		cls,
		clsImg,
		attr,
		widths,
		sizes,
		formats,
		alt,
		loading,
		decoding,
	});

	return `<!-- PICTURE ${properties} -->`;
};
