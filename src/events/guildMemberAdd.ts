import type { Event } from '../struct/types';
import { Events, type GuildMember, type Client, GuildTextBasedChannel } from 'discord.js';
import config from '../config';
import { log } from '../util';
import { welcome } from '../modules/welcome';

export const event: Event = {
	name: Events.GuildMemberAdd,
	async handle(member: GuildMember, client: Client<true>) {
		/**
		 * Assign bot role to bot users on join
		 */
		if (member.user.bot) {
			member.roles.add(config.roles.bot).catch(log);
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
		}
		const channel = await client.channels.fetch(config.channels.activity_log).catch((e) => {
			log(e);
			return null;
		});
		if (!channel) return;
		(channel as GuildTextBasedChannel).send({
			embeds: [
				{
					author: {
						name: 'Member Joined',
						icon_url: member.user.displayAvatarURL(),
					},
					thumbnail: {
						url: member.user.displayAvatarURL(),
					},
					color: 4437377,
					description: `<@${member.id}> ${member.user.tag}`,
					fields: [
						{
							name: 'Account Age',
							value: `<t:${Math.ceil(member.user.createdAt.getTime() / 1000)}:R>`,
						},
					],
				},
			],
		});
	},
};
