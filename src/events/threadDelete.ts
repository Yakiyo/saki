import type { Event } from '../struct/types';
import { Events, ThreadChannel } from 'discord.js';
import config from '../config';

export const event: Event = {
	name: Events.ThreadDelete,
	once: false,
	async handle(thread: ThreadChannel) {
		if (thread.parentId !== config.channels.modmail) return;
		const mail = await prisma.modmail.findUnique({
			where: {
				threadId: thread.id,
			},
		});
		if (!mail) return;
		// If an open modmail exists for that thread, close it.
		if (mail.isOpen) {
			prisma.modmail.update({
				where: {
					threadId: thread.id,
				},
				data: {
					isOpen: false,
				},
			});
		}
	},
};
