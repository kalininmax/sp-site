// import { gsap } from 'gsap';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
// gsap.registerPlugin(ScrollToPlugin);

// window.gsap = gsap;

// gsap.defaults({
// 	overwrite: 'auto',
// });

const HTML_CLASSLIST = document.documentElement.classList;

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {};
		this.modules = {};
		this.components = {};
		this.helpers = {};

		window.addEventListener('load', () => {
			HTML_CLASSLIST.remove('_loading');
		});
	}
}

window.ProjectApp = new ProjectApp();
