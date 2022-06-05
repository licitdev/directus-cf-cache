import * as DB from 'worktop/kv';

export interface Item {
	[field: string]: any;
}

export interface CFCacheOptions {
	preset_requests: PresetRequest[];
}

export interface PresetRequest {
	operation: 'list' | 'get';
	collection: string;
	key: string;
	enabled: boolean;
	file_paths: string | null;
	query_params: any;
}

const toPrefix = (collection: string, key: string) => `collection::${collection}::key::${key}::pk::`;
const toKeyname = (collection: string, key: string, pk: string) => toPrefix(collection, key) + pk;

export async function write(collection: string, key: string, pk: string, item: Item) {
	const kvKey = toKeyname(collection, key, pk);
	try {
		await DB.write(DIRECTUS_CF_CACHE_KV, kvKey, item);
		return item;
	} catch (err) {}
}

export async function read(collection: string, key: string, pk: string) {
	const kvKey = toKeyname(collection, key, pk);
	try {
		return await DB.read<Item>(DIRECTUS_CF_CACHE_KV, kvKey, 'json');
	} catch (err) {}
}

export function destroy(collection: string, key: string, pk: string) {
	const kvKey = toKeyname(collection, key, pk);
	return DB.remove(DIRECTUS_CF_CACHE_KV, kvKey);
}
