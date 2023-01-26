import type { Event } from '../struct/types';
import { Events, type Message } from 'discord.js';
import { log, sendLog, shorten } from '../util';

export const event: Event = {
	name: Events.MessageUpdate,
	once: false,
	async handle(oldMessage: Message, newMessage: Message) {
		// We dont listen to edits in interaction responses or dm messages
		// Additionally we don't listen to messages with same content
		if (
			newMessage.interaction ||
			!newMessage.inGuild() ||
			newMessage.author.bot ||
			oldMessage.content === newMessage.content
		)
			return;

		if (oldMessage.partial) {
			try {
				await oldMessage.fetch();
			} catch (e) {
				log(e);
				return;
			}
		}
		await newMessage.fetch().catch(log);
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
					value: shorten(oldMessage.content, 1010) || '*Uncached message*',
				},
				{
					name: 'After',
					value: (shorten(newMessage.content, 1010) as string) || '*Unable to receive content*',
				},
			],
			timestamp: new Date().toISOString(),
			footer: {
				text: `ID: ${newMessage.author.id}`,
			},
		});
	},
};
