import type { Event } from '../struct/types';
import { Events, type User } from 'discord.js';
import { boost } from '../modules/boost';
import { LogDestination, sendLog } from '../util';

export const event: Event = {
	name: Events.UserUpdate,
	once: false,
	async handle(oldUser: User, newUser: User) {
		const av = newUser.displayAvatarURL({
			extension: 'png',
			forceStatic: false,
			size: 1024,
		}) as string;

		// Audit logs
		if (oldUser.avatar !== newUser.avatar) {
			sendLog(
				{
					thumbnail: {
						url: av,
					},
					footer: {
						text: `ID: ${newUser.id}`,
					},
					color: 4437377,
					timestamp: new Date().toISOString(),
					title: 'User Avatar Update',
					author: {
						name: newUser.tag,
						icon_url: av,
					},
					description: `<@${newUser.id}>`,
				},
				LogDestination.activity,
			);
		}
	},
};
