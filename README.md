# svelte-bootstrap


## 프로젝트 생성

```
PS G:\github\svelte-bootstrap> cd ..
PS G:\github> npx degit sveltejs/template svelte-bootstrap
! destination directory is not empty, aborting. Use --force to override
PS G:\github> npx degit sveltejs/template svelte-bootstrap --force
> destination directory is not empty. Using --force, continuing
> cloned sveltejs/template#HEAD to svelte-bootstrap
PS G:\github>
```


생성된 rollup.config.js 파일의 내용은 다음과 같다. 
```jsx
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

```

## Node Module 설치
```
npm install
```





## typescript 전환 
```
node scripts/setupTypeScript.js
```

typescript 관련 의존성이 추가된다. 
필요한 모듈 설치한다. 

```
npm install
```

## svelte-preprocess 설치
typescript 전환하면서 이미 설치되어 있다. 
```
npm install -D svelte-preprocess
```

## Autoprefixer과 postcss 설치
```
npm i -D typescript sass postcss autoprefixer 
```

rollup.config.js 수정한다. 
```jsx
			preprocess: sveltePreprocess({ 
				sourceMap: !production,
				postcss: {
					plugins: [require('autoprefixer')()]
				}
			}),
```            



App.svelte의 style에 lang="scss"를 추가한다. 

```
<style lang="scss">
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>
```
빌드하고 실행하면 정상이다. 이제  svelte 컴포넌트에서 sass를 사용할 수 있다. 


몇가지 변수(variables)들을 가지는 SCSS 파일이 필요한 상황이다. src/styles/variables.scss 파일을 생성한다고 가정한다. 

```scss
// src/styles/variables.scss
$primary-color: red;
```
여느 SCSS 프로젝트에서와 마찬가지로 @use './path/to/variables.scss 를 사용할 수도 있찌만, 좀 지루할 수도 있다.  svelte-preprocess는 prependData를 받아 들인다. import를 가장하기 위해 그것을 사용하자. 

scss: {} 를 추가한다. 

```jsx
			preprocess: sveltePreprocess({ 
				sourceMap: !production,
				scss: {
				   // We can use a path relative to the root because
				   // svelte-preprocess automatically adds it to `includePaths`
				   // if none is defined.
				   prependData: `@import 'src/styles/variables.scss';`
				},
				postcss: {
					plugins: [require('autoprefixer')()]
				}
			}),
```

이제 변수를 참조 할 수 있다. 
```html
<style lang="scss">
  h1 {
    color: $primary-color;
  }
</style>
```


여기까지는 [sveltejs/svelte-preprocess](https://github.com/sveltejs/svelte-preprocess/blob/main/docs/getting-started.md)의 설명을 참고로 했다. 





## bootstrap 설치 
Bootstrap을 scss를 사용하지 않고 그냥 사용하는 것은 컴파일된 소스를 사용하면 된다.

여기서는 Svelte 컴포넌트 안에서 bootstrap을 직접 사용하는 방법을 살펴본다. 

먼저 설치한다. 

```
npm install bootstrap
```

이 설명은 [Svelte - Adding SCSS and Bootstrap to your project](https://tongere.hashnode.dev/svelte-adding-scss-and-bootstrap-to-your-project)를 참고하여 작성한다. 



App.svelte 컴포넌트의 style 섹션에 다음을 추가한다. 
```
@import "../node_modules/bootstrap/scss/bootstrap.scss";
```

페이지가 reload 되면 약간의 변화를 느낀다. 

이제, 부스스트랩 클래스들을 추가하기 위해서 HTML을 바꾼다. 
```html
<main class="container">
    <h1 class="text-secondary">Hello {name}!</h1>

    <div>
        <p class="text-primary">SASS is working!</p>
    </div>
</main>
```

> 그러나, 이거 좋은 방법이 아니다. 빌드 하는데 시간이 많이 걸린다. 개발할 때 쓰기 어렵다. 

부트스트랩 변수를 오버라이드하기 위해서는 먼저 선언한다. 

```html
<style lang="scss" type="text/scss">
    $primary: yellow;

    $secondary: orange;

    @import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>
```




## Global vs Local 


우리가 처리해야 할 작은 세부 사항이 하나 있습니다. 우리는 구성 요소 안에 있기 때문에 Svelte는 기본적으로 해당 구성 요소 내부에서 수행하는 모든 스타일을 유지합니다. 모든 구성 요소에 대해 이 모든 스타일을 다시 작성해야 합니다. 어떤 면에서 이것이 우리가 구성 요소를 좋아하는 이유입니다. 각 구성 요소는 다른 모든 구성 요소와 독립적입니다. 문제를 서로 혼동하지 않으면 문제 해결이 훨씬 쉽습니다.

그러나 Bootstrap과 색 구성표를 사용하면 모든 구성 요소가 동일한 색 구성표를 사용하기를 원할 가능성이 큽니다.

Svelte가 CSS를 전역적으로 적용하도록 global하려면 스타일 요소에 속성을 추가해야 합니다. \<style global lang="scss" type="text/scss"\>. 이 속성은 SCSS 또는 Bootstrap에만 해당되는 것이 아닙니다. 모든 Svelte 구성 요소에서 CSS 집합을 전역적으로 만들려면 global.


>  Svelte에서 BootStrap을 커스터마이징하려면 빌드하는데 시간이 많이 걸리므로 UX 개발자가 빌드한 파일을 가져다 쓰는 형태로 개발하는 것이 좋다. 


이제 전역적으로 BootStrap을 쓰는 방법을 살펴본다. 


### 사전 컴파일된 CSS 불러오기 
먼저 src/styles/__custom.scss 파일을 직접 만든다. 다음과 같이 작성한다. 

```
@import "~bootstrap/scss/bootstrap";
```


이를 통해 기본 제공 커스텀 변수를 다음과 같이 재정의한다. 

```scss

// Default variable overrides
$body-bg: yellow;
$body-color: red;

@import "~bootstrap/scss/bootstrap";

```


main.js에 scss 파일을 임포트한다. 

```ts
import App from './App.svelte';

import './scss/custom.scss';


const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;

```

다음을 설치한다. 
```
npm install -D sass-loader
npm install -D  rollup-plugin-postcss
npm install -D  autoprefixer  # 이미 설치되어 있음 
npm install -D  postcss-import
```

rollup.config.js에 다음을 import한다. 
```jsx
import postcss from "rollup-plugin-postcss";
import autoprefixer from 'autoprefixer';
import cssimport from 'postcss-import';
```

plugins에 다음을 추가한다. 
```jsx
        postcss({
            //includePaths: ['src/'],  // 의미없음
            extensions: ['.css', '.scss', '.sass'],  // 설정된 확장자로 끝나는 파일들을 처리,
            // bundle.js가 생성되는 디렉터리에 global.css 파일이 생성 된다.
            extract: 'global.css',  // true로 설정하면 bundle.css 파일이 생성된다. 
            inject: true,  // default: true, css를 bundle.js에 삽입한다.
            plugins: [cssimport(), autoprefixer()],  // PostCSS plugins
          }),
```		  


