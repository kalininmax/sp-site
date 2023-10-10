class Examples {
	constructor() {
		this.init();
	}

	init() {
		this.container = document.querySelector('.examples');

		if (!this.container) {
			return;
		}

		const counterButton = document.querySelector('[data-counter]');
		const counterText = counterButton.textContent;
		counterButton.count = 0;

		counterButton.textContent = `${counterText} ${counterButton.count}`;
		counterButton.addEventListener('click', () => {
			counterButton.count++;
			counterButton.textContent = `${counterText} ${counterButton.count}`;
		});
	}
}

export default new Examples();
