module.exports = {
	name: 'directus-cf-cache-worker',
	zoneid: process.env.CLOUDFLARE_ZONEID,
	accountid: process.env.CLOUDFLARE_ACCOUNTID,
	token: process.env.CLOUDFLARE_TOKEN,
	entry: 'index.ts',
	routes: process.env.WORKER_ROUTES.split(',').filter((route) => route),
	globals: {
		DIRECTUS_CF_CACHE_KV: `KV:${process.env.DIRECTUS_CF_CACHE_KV}`,
		DIRECTUS_ACCESS_TOKEN: `ENV:${process.env.DIRECTUS_ACCESS_TOKEN}`,
		DIRECTUS_SERVER_URL: `ENV:${process.env.DIRECTUS_SERVER_URL}`,
	},
};
