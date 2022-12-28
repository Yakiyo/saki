import type { Event } from '../struct/types';
import { Events, type GuildMember, type Client } from 'discord.js';
import config from '../config';
import { log } from '../util';
import { welcome } from '../modules/welcome';

export const event: Event = {
	name: Events.GuildMemberAdd,
	async handle(member: GuildMember, client: Client<true>) {
		/**
		 * Assign Member role to users on join
		 */
		if (!member.user.bot) {
			member.roles.add(config.roles.member).catch(log);
		}

		const isEnabled = await global.prisma.modules
			.findUnique({
				where: {
					id: 1,
				},
			})
			.then((m) => m?.Welcome);

		if (!member.user.bot && isEnabled === true) {
			welcome(member, client);
		} else {
			console.log('skipped');
		}
	},
};
