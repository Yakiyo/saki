import type { Event } from '../struct/types';
import { Events, type GuildMember } from 'discord.js';
import { boost } from '../modules/boost';

export const event: Event = {
	name: Events.GuildMemberUpdate,
	once: false,
	async handle(oldMember: GuildMember, newMember: GuildMember) {
		console.log(oldMember, newMember);
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
	},
};
