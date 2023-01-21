import type { Event } from '../struct/types';
import { Events, ChannelType as CT, type Message } from 'discord.js';
import config from '../config';

export const event: Event = {
	name: Events.MessageCreate,
	once: false,
	async handle(message: Message) {
		if (message.author.bot) return;
		switch (message.channel.type) {
			case CT.DM: {
				if (message.content.startsWith(';')) return;
				return;
			}

			case CT.GuildText: {
				if (message.channelId !== config.channels.modmail) return;
				return;
			}

			default:
				return;
		}
	},
};
