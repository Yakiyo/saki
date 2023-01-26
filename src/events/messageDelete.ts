import type { Event } from '../struct/types';
import { Events, Message, APIEmbed } from 'discord.js';
import { LogDestination, sendLog } from '../util';

export const event: Event = {
	name: Events.MessageDelete,
	once: false,
	async handle(message: Message) {
		if (!message.inGuild() || message.interaction) return;
		const embed: APIEmbed = {
			author: {
				name: message.author.tag,
				icon_url: message.author.displayAvatarURL() as string | undefined,
			},
			fields: [],
			color: 16729871,
			description: `**Message sent by <@${message.author.id}> deleted in <#${message.channelId}>**\n${message.content}`,
			timestamp: new Date().toISOString(),
			footer: {
				text: `ID: ${message.author.id}`,
			},
		};
		const attachments = [];
		for (const [_, attachment] of message.attachments) {
			attachments.push(attachment.name);
		}
		if (attachments.length) {
			embed.fields?.push({
				name: 'Attachments',
				value: attachments.join(', '),
			});
		}
		sendLog(embed, LogDestination.activity);
	},
};
