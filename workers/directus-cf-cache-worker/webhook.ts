export interface Webhook {
	collection: string;
	event: 'items.create' | 'items.update' | 'items.delete';
	payload: any;
	keys?: (string | number)[];
	key?: string | number;
}
