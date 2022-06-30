import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import postcss from "rollup-plugin-postcss";
import autoprefixer from 'autoprefixer';
import cssimport from 'postcss-import'


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
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// Svelte 컴포넌트의 style 섹션에서 scss를 쓰기 위한 설정
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
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		//css({ output: 'bundle.css' }),

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
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		postcss({
			// src 아래의 css 파일들 및 Svelte component 안의 css를 global.css로 생성 
            //includePaths: ['src/**/*'], // 이거는 의미가 없음
            extensions: ['.css', '.scss', '.sass'],  // 설정된 확장자로 끝나는 파일들을 처리,
            // bundle.js가 생성되는 디렉터리에 global.css 파일이 생성 된다.
            extract: 'global.css',  // true로 설정하면 bundle.css 파일이 생성된다. 
            inject: true,  // default: true, css를 bundle.js에 삽입한다.
            plugins: [cssimport(), autoprefixer()],  // PostCSS plugins
          }),

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
