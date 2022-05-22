import * as Items from './itemsStore';
// import type { CFCacheOptions } from './itemsStore';
import type { Webhook } from './webhook';
import type { Handler } from 'worktop';

async function getCFCacheOptions() {
	const url = new URL(`${DIRECTUS_SERVER_URL}/items/directus_cf_cache_options`);

	url.search = new URLSearchParams({
		fields: '*.*',
		access_token: DIRECTUS_ACCESS_TOKEN,
	}).toString();

	const resp = await fetch(url);

	console.log({ resp, sent: true });

	// const data = await Items.read('cf_cache_options', '', '');
	// if (!data) {
	// 	throw new Error('');
	// }
}

/**
 * GET /list/:collection
 * GET /list/:collection/:key
 */
export const listItems: Handler = async function (req, res) {
	const { collection, key } = req.params;
	const data = await Items.read(collection, key, '');

	res.send(200, data);
};

/**
 * GET /fetch/:collection/:item
 * GET /fetch/:collection/:item/:key
 */
export const getItem: Handler = async function (req, res) {
	const { collection, key, pk } = req.params;
	const data = await Items.read(collection, key, pk);

	res.send(200, data);
};

/**
 * POST /webhook
 */
export const webhook: Handler = async function (req, res) {
	await getCFCacheOptions();

	const body = await req.body.json<Webhook>();

	if (!body || !body.event || !body.collection || !(body.key || body.keys) || !body.payload)
		return res.send(400, { message: 'Invalid webhook request.' });

	let key = '';
	let pk = '';

	switch (body.event) {
		case 'items.create':
			if (!body.key) return res.send(400, { message: 'Invalid webhook request.' });

			break;
		case 'items.update':
			if (!body.keys) return res.send(400, { message: 'Invalid webhook request.' });

			break;
		case 'items.delete':
			if (!body.keys) return res.send(400, { message: 'Invalid webhook request.' });

			break;
	}

	res.send(200, { message: 'OK' });

	// const result = await Items.write('some collection name here', key, pk, body);

	// if (result) res.send(200, 'OK');
	// else res.send(500, 'Error creating item');
};
