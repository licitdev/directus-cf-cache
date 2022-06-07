import { Router, listen } from 'worktop';
import type { KV } from 'worktop/kv';
import * as CORS from 'worktop/cors';
import * as api from './api';

declare global {
	const DIRECTUS_SERVER_URL: string;
	const DIRECTUS_ACCESS_TOKEN: string;
	const DIRECTUS_CF_CACHE_KV: KV.Namespace;
	const DIRECTUS_WEBHOOK_SECRET: string;
}

const API = new Router();

API.prepare = CORS.preflight({
	origin: '*',
	headers: ['Cache-Control', 'Content-Type', 'Secret'],
	methods: ['HEAD', 'GET', 'POST'],
	maxage: 600,
});

API.add('GET', '/list/:collection', api.listItems);
API.add('GET', '/list/:collection/:key', api.listItems);
API.add('GET', '/get/:collection/:pk', api.getItem);
API.add('GET', '/get/:collection/:pk/:key', api.getItem);
API.add('GET', '/assets/:pk', api.getAsset);
API.add('POST', '/webhook', api.webhook);

listen(API.run);
