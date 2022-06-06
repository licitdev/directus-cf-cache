const SERVER_URL = import.meta.env.VITE_DIRECTUS_CF_CACHE_URL;

export const listItems = async (collection: string, key?: string) => {
	const url = `${SERVER_URL}/list/${collection}/${key ?? ''}`;
	const response = await fetch(url);
	if (response.status >= 400) {
		return [];
	}
	const data = await response.json();
	return data;
};

export const getItem = async (collection: string, pk: string, key?: string) => {
	const url = `${SERVER_URL}/get/${collection}/${pk}/${key ?? ''}`;
	const response = await fetch(url);
	if (response.status >= 400) {
		return {};
	}
	const data = await response.json();
	return data;
};

export const getAssetUrl = (pk: string) => {
	return `${SERVER_URL}/assets/${pk}`;
};
