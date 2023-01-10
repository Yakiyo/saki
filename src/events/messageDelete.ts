import type { Event } from '../struct/types';
import { Events, Message, APIEmbed } from 'discord.js';
import { LogDestination, sendLog } from '../util';

export const event: Event = {
	name: Events.MessageDelete,
	once: false,
	async handle(message: Message) {
		if (!message.guild) return;
		const embed: APIEmbed = {
			author: {
				name: message.author.tag,
				icon_url: message.author.avatarURL() as string | undefined,
			},
			color: 16729871,
			description: `**Message sent by <@${message.author.id}> deleted in <#${message.channelId}>**\n${message.content}`,
			timestamp: new Date().toISOString(),
			footer: {
				text: `ID: ${message.author.id}`,
			},
		};
		sendLog(embed, LogDestination.activity);
	},
};
