import type { Event } from '../struct/types';
import { Events, ThreadChannel } from 'discord.js';
import { log } from '../util';

export const event: Event = {
	name: Events.ThreadCreate,
	once: false,
	async handle(thread: ThreadChannel) {
		if (!thread.joined) thread.join().catch(log);
		return;
	},
};
