import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueSafeHTML, { allowedTags } from 'vue-safe-html';

const sanitizeConfig = {
	allowedTags: [
		...allowedTags,
		'blockquote',
		'img',
		'ol',
		'ul',
		'li',
		'a',
		'p',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'strong',
		'em',
		'code',
		'pre',
		'table',
		'thead',
		'tbody',
		'tr',
		'th',
		'td',
		'br',
		'hr',
		'div',
		'span',
	],
};

createApp(App).use(VueSafeHTML, sanitizeConfig).use(router).mount('#app');
