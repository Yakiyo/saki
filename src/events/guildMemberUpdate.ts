import type { Event } from '../struct/types';
import { Events, type GuildMember } from 'discord.js';
import { boost } from '../modules/boost';
import { LogDestination, sendLog } from '../util';

export const event: Event = {
	name: Events.GuildMemberUpdate,
	once: false,
	async handle(oldMember: GuildMember, newMember: GuildMember) {
		console.log('Running guildmeme update');
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

		// Audit logs
		if (oldMember.user.avatar !== newMember.user.avatar) {
			const av = newMember.user.avatarURL({
				extension: 'png',
				forceStatic: false,
				size: 1024,
			}) as string;
			
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
	},
};
