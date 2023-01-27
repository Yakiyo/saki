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

		const av = newMember.displayAvatarURL({
			extension: 'png',
			forceStatic: false,
			size: 1024,
		}) as string;

		// Audit logs
		if (oldMember.avatar !== newMember.avatar) {
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
					title: 'Server Avatar Update',
					author: {
						name: newMember.user.tag,
						icon_url: av,
					},
					description: `<@${newMember.id}>`,
				},
				LogDestination.activity,
			);
		}

		// Might wanna move this to userUpdate.ts
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

		const addedRoles = newMember.roles.cache.filter((_, role) => !oldMember.roles.cache.has(role));
		const removedRoles = oldMember.roles.cache.filter(
			(_, role) => !newMember.roles.cache.has(role),
		);

		if (addedRoles.size || removedRoles.size) {
			const action = addedRoles.size ? 'given' : 'removed from';
			const role = addedRoles.size ? addedRoles?.first()?.id : removedRoles?.first()?.id;
			sendLog(
				{
					footer: {
						text: `ID: ${newMember.id}`,
					},
					color: 3375061,
					timestamp: new Date().toISOString(),
					author: {
						name: newMember.user.tag,
						icon_url: av,
					},
					description: `<@${newMember.id}> **was ${action} the <@&${role}> role.**`,
				},
				LogDestination.activity,
			);
		}
	},
};
