import type { Event } from '../struct/types';
import { Events, type Message } from 'discord.js';
import { log, sendLog, shorten } from '../util';

export const event: Event = {
	name: Events.MessageUpdate,
	once: false,
	async handle(oldMessage: Message, newMessage: Message) {
		if (oldMessage.partial) {
			try {
				await oldMessage.fetch();
			} catch (e) {
				log(e);
				return;
			}
		}
		sendLog({
			color: 3375061,
			author: {
				name: newMessage.author.tag,
				icon_url: newMessage.author.displayAvatarURL(),
			},
			description: `**Message edited in <#${newMessage.channelId}>**\n[Jump link](${newMessage.url})`,
			fields: [
				{
					name: 'Before',
					value:
						shorten(oldMessage.content, 1010) || '**Uncached message, could not receive content**',
				},
				{
					name: 'After',
					value: shorten(newMessage.content, 1010) as string,
				},
			],
			timestamp: new Date().toISOString(),
			footer: {
				text: `ID: ${newMessage.author.id}`,
			},
		});
	},
};
