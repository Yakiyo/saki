import type { Client, Event } from './types';
import { join, resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { log } from '../util';

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
				client.once(event.name, (...args) => {
					try {
						event.handle(...args, client);
					} catch (e) {
						log(e);
					}
				});
			} else {
				client.on(event.name, (...args) => {
					try {
						event.handle(...args, client);
					} catch (e) {
						log(e);
					}
				});
			}
		}
	}
}
