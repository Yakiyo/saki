import type { Event } from '../struct/types';
import { Events, GuildMember } from 'discord.js';
import { dateTimestamp, sendLog } from '../util';

export const event: Event = {
	name: Events.GuildMemberRemove,
	once: false,
	async handle(member: GuildMember) {
		const roles: string[] = [];
		member.roles.cache.forEach((v) => roles.push(`<@&${v.id}>`));
		sendLog({
			color: 16729871,
			author: {
				icon_url: member.user.displayAvatarURL(),
				name: 'Member Left',
			},
			description: `<@${member.id}> ${member.user.tag}`,
			fields: [
				{
					name: 'Roles',
					value: roles.join(', '),
				},
				{
					name: 'Joined',
					value: dateTimestamp(member.joinedAt as Date),
				},
			],
			thumbnail: {
				url: member.user.displayAvatarURL({
					size: 1024,
				}),
			},
			timestamp: new Date().toISOString(),
			footer: {
				text: `ID: ${member.id}`,
			},
		});
	},
};
