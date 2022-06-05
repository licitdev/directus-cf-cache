import * as Items from './itemStore';
import * as Assets from './assetStore';
import type { CFCacheOptions, PresetRequest } from './itemStore';
import type { Webhook } from './webhook';
import type { Handler } from 'worktop';
import { get } from 'lodash';

const TABLE_CF_CACHE_OPTIONS = 'cf_cache_options';

/**
 * GET /list/:collection
 * GET /list/:collection/:key
 */
export const listItems: Handler = async function (req, res) {
	const { collection, key } = req.params;
	const data = await Items.read(collection, key ?? '', '');

	if (!data) {
		return res.send(404);
	}

	res.send(200, data);
};

/**
 * GET /get/:collection/:pk
 * GET /get/:collection/:pk/:key
 */
export const getItem: Handler = async function (req, res) {
	const { collection, key, pk } = req.params;
	const data = await Items.read(collection, key ?? '', pk);

	if (!data) {
		return res.send(404);
	}

	res.send(200, data);
};

/**
 * GET /assets/:pk
 */
export const getAsset: Handler = async function (req, res) {
	const { pk } = req.params;
	const asset = await Assets.read(pk);

	if (!asset) {
		return res.send(404);
	}

	res.writeHead(200);
	res.end(asset);
};

/**
 * POST /webhook
 */
export const webhook: Handler = async function (req, res) {
	if (!req.body || !req.headers.has('Content-Type') || req.headers.get('Content-Type') !== 'application/json') {
		return res.send(400, { message: 'Invalid webhook request.' });
	}

	const body = await req.body.json<Webhook>();

	if (!body || !body.event || !body.collection || !(body.key || body.keys) || !body.payload)
		return res.send(400, { message: 'Invalid webhook request.' });

	const cfCacheOptions = await getCFCacheOptions();

	if (!cfCacheOptions) {
		return res.send(400, { message: 'Unable to retrieve cache options.' });
	}

	switch (body.event) {
		case 'items.create':
			if (!body.key) return res.send(400, { message: 'Invalid webhook request.' });

			if (body.collection === TABLE_CF_CACHE_OPTIONS) {
				await saveCFCacheOptions();
			} else {
				for (const preset of cfCacheOptions.preset_requests) {
					if (preset.collection === body.collection) {
						if (preset.operation === 'get') {
							await saveItem(preset, body.collection, preset.key, body.key);
						} else if (preset.operation === 'list') {
							await saveList(preset, body.collection, preset.key);
						}
					}
				}
			}
			break;
		case 'items.update':
			if (!body.keys) return res.send(400, { message: 'Invalid webhook request.' });

			if (body.collection === TABLE_CF_CACHE_OPTIONS) {
				await saveCFCacheOptions();
			} else {
				for (const preset of cfCacheOptions.preset_requests) {
					if (preset.collection === body.collection) {
						if (preset.operation === 'get') {
							await saveItem(preset, body.collection, preset.key, body.keys);
						} else if (preset.operation === 'list') {
							await saveList(preset, body.collection, preset.key);
						}
					}
				}
			}
			break;
		case 'items.delete':
			if (!body.keys) return res.send(400, { message: 'Invalid webhook request.' });

			for (const preset of cfCacheOptions.preset_requests) {
				if (preset.collection === body.collection) {
					if (preset.operation === 'get') {
						await deleteItem(body.collection, preset.key, body.keys);
					} else if (preset.operation === 'list') {
						await saveList(preset, body.collection, preset.key);
					}
				}
			}
			break;
		default:
			return res.send(400, { message: 'Invalid webhook request.' });
	}

	return res.send(200, { message: 'OK' });
};

async function getCFCacheOptions() {
	const cfCacheOptions = await Items.read(TABLE_CF_CACHE_OPTIONS, '', '');

	if (cfCacheOptions) {
		return cfCacheOptions;
	}

	const url = new URL(`${DIRECTUS_SERVER_URL}/items/${TABLE_CF_CACHE_OPTIONS}`);

	url.search = new URLSearchParams({
		fields: '*.*',
		access_token: DIRECTUS_ACCESS_TOKEN,
	}).toString();

	const response = await fetch(url);

	if (response.status === 200) {
		const responseData = await response.json();
		if (responseData.data) {
			await Items.write(TABLE_CF_CACHE_OPTIONS, '', '', responseData.data);

			return responseData.data as CFCacheOptions;
		}
	}

	throw new Error(`Unable to load "${TABLE_CF_CACHE_OPTIONS}".`);
}

async function saveCFCacheOptions() {
	const url = new URL(`${DIRECTUS_SERVER_URL}/items/${TABLE_CF_CACHE_OPTIONS}`);

	url.search = new URLSearchParams({
		fields: '*.*',
		access_token: DIRECTUS_ACCESS_TOKEN,
	}).toString();

	const response = await fetch(url);

	if (response.status === 200) {
		const responseData = await response.json();
		if (responseData.data) {
			await Items.write(TABLE_CF_CACHE_OPTIONS, '', '', responseData.data);
		}
	}
}

async function saveList(preset: PresetRequest, collection: string, key: string) {
	if (!key) key = '';

	const url = new URL(`${DIRECTUS_SERVER_URL}/items/${collection}`);

	preset.query_params['filter'] = JSON.stringify(preset.query_params['filter']);

	url.search = new URLSearchParams({
		...preset.query_params,
		access_token: DIRECTUS_ACCESS_TOKEN,
	}).toString();

	const response = await fetch(url);

	if (response.status !== 200) {
		throw new Error(`Unable to load list for collection "${collection}" and key "${key}".`);
	}

	const item = await response.json();

	if (!item.data) {
		throw new Error(`Missing list data for collection "${collection}" and key "${key}".`);
	}

	const result = await Items.write(collection, key, '', item.data);

	if (!result) {
		throw new Error(`Unable to save list for collection "${collection}" and key "${key}".`);
	}
}

async function saveItem(
	preset: PresetRequest,
	collection: string,
	key: string,
	pk: (string | number) | (string | number)[]
) {
	if (Array.isArray(pk)) {
		for (const primaryKey of pk) {
			await saveItem(preset, collection, key, primaryKey);
		}
		return;
	}

	if (!key) key = '';

	const url = new URL(`${DIRECTUS_SERVER_URL}/items/${collection}/${pk}`);

	url.search = new URLSearchParams({
		...preset.query_params,
		access_token: DIRECTUS_ACCESS_TOKEN,
	}).toString();

	const response = await fetch(url);

	if (response.status !== 200) {
		throw new Error(`Unable to load item for collection "${collection}", key "${key}" and pk "${pk}".`);
	}

	const item = await response.json();

	if (!item.data) {
		throw new Error(`Missing item data for collection "${collection}", key "${key}" and pk "${pk}"`);
	}

	const result = await Items.write(collection, key, String(pk), item.data);

	if (!result) {
		throw new Error(`Unable to save item for collection "${collection}", key "${key}" and pk "${pk}"`);
	}

	if (preset.file_paths) {
		for (const path of preset.file_paths) {
			const assetId = get(result, path);
			if (assetId) {
				const assetUrl = new URL(`${DIRECTUS_SERVER_URL}/assets/${assetId}`);
				assetUrl.search = new URLSearchParams({
					access_token: DIRECTUS_ACCESS_TOKEN,
				}).toString();
				const assetResponse = await fetch(assetUrl);
				if (assetResponse.status === 200) {
					await Assets.write(assetId, await assetResponse.body);
				}
			}
		}
	}
}

async function deleteItem(collection: string, key: string, pk: (string | number) | (string | number)[]) {
	if (Array.isArray(pk)) {
		for (const primaryKey of pk) {
			await deleteItem(collection, key, primaryKey);
		}
		return;
	}

	if (!key) key = '';

	const result = await Items.destroy(collection, key, String(pk));

	if (!result) {
		throw new Error(`Unable to delete item for collection "${collection}" and key "${key}" and pk "${pk}"`);
	}
}
