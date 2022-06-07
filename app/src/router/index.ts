import { createWebHistory, createRouter } from 'vue-router';
import Home from '../views/Home.vue';
import Article from '../views/Article.vue';
import Articles from '../views/Articles.vue';
import Projects from '../views/Projects.vue';
import People from '../views/People.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
	{
		path: '/',
		component: Home,
	},
	{
		path: '/articles',
		component: Articles,
	},
	{
		path: '/articles/:key',
		component: Articles,
	},
	{
		path: '/article/:pk',
		component: Article,
	},
	{
		path: '/projects',
		component: Projects,
	},
	{
		path: '/people',
		component: People,
	},
	{
		path: '/:catchAll(.*)',
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
