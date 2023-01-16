import type { Event } from '../struct/types';
import { Events, type GuildMember } from 'discord.js';
import { boost } from '../modules/boost';
import { LogDestination, sendLog } from '../util';

export const event: Event = {
	name: Events.GuildMemberUpdate,
	once: false,
	async handle(oldMember: GuildMember, newMember: GuildMember) {
		const isEnabled = await prisma.modules
			.findUnique({
				where: {
					id: 1,
				},
			})
			.then((m) => m?.Boost);

		if (isEnabled && !oldMember.premiumSince && newMember.premiumSince) {
			boost(newMember);
		}

		const av = newMember.user.avatarURL({
			extension: 'png',
			forceStatic: false,
			size: 1024,
		}) as string;

		// Audit logs
		if (oldMember.user.avatar !== newMember.user.avatar) {
			sendLog(
				{
					thumbnail: {
						url: av,
					},
					footer: {
						text: `ID: ${newMember.id}`,
					},
					color: 4437377,
					timestamp: new Date().toISOString(),
					title: 'Avatar Update',
					author: {
						name: newMember.user.tag,
						icon_url: av,
					},
					description: `<@${newMember.id}>`,
				},
				LogDestination.activity,
			);
		}

		if (oldMember.user.tag !== newMember.user.tag) {
			sendLog(
				{
					footer: {
						text: `ID: ${newMember.id}`,
					},
					color: 4437377,
					timestamp: new Date().toISOString(),
					title: 'Username Update',
					author: {
						name: newMember.user.tag,
						icon_url: av,
					},
					description: `Old: ${oldMember.user.tag}\nNew: ${newMember.user.tag}\n\n<@${newMember.id}>`,
				},
				LogDestination.activity,
			);
		}
	},
};
