import type { Client, Event } from './types';
import { join, resolve } from 'node:path';
import { readdirSync } from 'node:fs';

export class EventHandler {
	constructor(client: Client) {
		this.init(client);
	}

	private init(client: Client) {
		const path = join(__dirname, '..', 'events');
		const files = readdirSync(path).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));

		for (const file of files) {
			const { event } = require(resolve(process.cwd(), `${path}/${file}`)) as {
				event: Event;
			};
			if (event.once) {
				// @ts-expect-error
				client.once(event.name, (...args) => event.handle(...args, client));
			} else {
				// @ts-expect-error
				client.on(event.name, (...args) => event.handle(...args, client));
			}
		}
	}
}
