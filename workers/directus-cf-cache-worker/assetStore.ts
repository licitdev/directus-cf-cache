import * as DB from 'worktop/kv';

const toPrefix = (pk: string) => `assets::${pk}`;

export async function write(pk: string, asset: any) {
	const kvKey = toPrefix(pk);
	try {
		await DB.write(DIRECTUS_CF_CACHE_KV, kvKey, asset);
		return asset;
	} catch (err) {}
}

export async function read(pk: string) {
	const kvKey = toPrefix(pk);
	try {
		return await DB.read(DIRECTUS_CF_CACHE_KV, kvKey, 'stream');
	} catch (err) {}
}

export function destroy(pk: string) {
	const kvKey = toPrefix(pk);
	return DB.remove(DIRECTUS_CF_CACHE_KV, kvKey);
}
