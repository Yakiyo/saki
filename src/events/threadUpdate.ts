import type { Event } from '../struct/types';
import { Events, type ThreadChannel } from 'discord.js';
import config from '../config';

export const event: Event = {
	name: Events.ThreadUpdate,
	once: false,
	async handle(oldThread: ThreadChannel, newThread: ThreadChannel) {
		if (newThread.parentId !== config.channels.modmail) return;

		const isOpen = await prisma.modmail
			.findUnique({
				where: {
					threadId: newThread.id,
				},
			})
			.then((m) => m?.isOpen);
		// If a an open modmail on that thread exists, and it gets auto
		// archived, unarchive it.
		if (!oldThread.archived && newThread.archived && isOpen) {
			newThread.setArchived(false);
		}
	},
};
