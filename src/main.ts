import App from './App.svelte';

// 부트스트랩을 커스터마이징하려면 다음줄을 주석 처리한다 
import 'bootstrap/dist/css/bootstrap.min.css';
// 부트스트랩을 커스터마이징하기 위해서 임포트
import './scss/custom.scss';

// bootstrap javascript 임포트
import "bootstrap";
//import * as bootstrap from   "bootstrap";


const app = new App({
	//target: document.body,
	target: document.querySelector("#app"),
	props: {
		name: 'world'
	}
});

export default app;