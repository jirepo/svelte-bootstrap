import App from './App.svelte';

import './scss/custom.scss';


const app = new App({
	//target: document.body,
	target: document.querySelector("#app"),
	props: {
		name: 'world'
	}
});

export default app;