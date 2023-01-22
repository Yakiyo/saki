import type { Event } from '../struct/types';
import { Events, type ThreadChannel } from 'discord.js';
import config from '../config';

export const event: Event = {
	name: Events.ThreadUpdate,
	once: false,
	async handle(oldThread: ThreadChannel, newThread: ThreadChannel) {
		if (newThread.parentId !== config.channels.modmail) return;

		// If a modmail thread gets auto archived, unarchive it.
		if (!oldThread.archived && newThread.archived) {
			newThread.setArchived(false);
		}
	},
};
