const { readFileSync } = require('fs');

module.exports = () => {
	try {
		return readFileSync('build/assets/images/svg/sprite.svg', 'utf8');
	} catch (error) {
		console.warn('SVG Sprite file doesn`t exist');
	}
	return;
}
