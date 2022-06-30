import App from './App.svelte';

// 부트스트랩을 커스터마이징하기 위해서 임포트
import './scss/custom.scss';

const app = new App({
	//target: document.body,
	target: document.querySelector("#app"),
	props: {
		name: 'world'
	}
});

export default app;