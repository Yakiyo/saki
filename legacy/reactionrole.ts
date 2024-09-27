import { PrismaClient } from '@prisma/client';
import { type MessageReaction, type User } from 'discord.js';
import { log } from '../src/util';

// impromptu line for evading error
let prisma = new PrismaClient();

export async function reactionRole(reaction: MessageReaction, user: User) {
	if (user.bot) return;

	const rr = await prisma.reactionroles.findFirst({
		where: {
			reaction: reaction.emoji.id || reaction.emoji.name || undefined,
			message: reaction.message.id,
		},
	});

	// We prolly dont have any reaction roles in that message with that reaction
	if (!rr) return;

	const role = await reaction.message.guild?.roles.fetch(rr.role).catch((e) => {
		log(e);
		return null;
	});

	if (!role) return;

	const member = await reaction.message.guild?.members.fetch(user).catch(log);

	if (!member) return;

	const hasRole = member.roles.cache.has(role.id);
	try {
		/// If user doesnt have role, add it
		if (!hasRole) {
			await member.roles.add(role.id);
			// Only send the dms on normal reaction roles
			if (rr.type !== 'VERIFY') {
				await user.send(`> Added role **${role.name}**!`).catch((e) => {
					if (e.code !== 50007) log(e); // error code 50007 means user doesnt have dms open, so we ignore it
					return null;
				});
			}
		} else {
			// user has the role, if type is verify, dont do anything. else remove the role
			if (rr.type !== 'VERIFY') {
				await member.roles.remove(role.id);
				await user.send(`> Removed role **${role.name}**!`).catch((e) => {
					if (e.code !== 50007) log(e);
					return;
				});
			}
		}
	} catch (e) {
		log(e);
	} finally {
		await reaction.users.remove(user.id).catch(log);
	}
}
