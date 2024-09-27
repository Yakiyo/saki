import type { Event } from '../struct/types';
import { Events, MessageReaction, User } from 'discord.js';
import { log } from '../util';
// import { reactionRole } from '../../legacy/reactionrole';
import { spotlight } from '../modules/spotlight';

export const event: Event = {
	name: Events.MessageReactionAdd,
	once: false,
	async handle(reaction: MessageReaction, _user: User) {
		// if the reaction isnt cached, fetch it first.
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (e) {
				log(e);
				return;
			}
		}

		const mod = await prisma.modules.findUnique({
			where: {
				id: 1,
			},
		});

		// if (mod?.Reaction_Roles) reactionRole(reaction, user);

		if (mod?.Starboard) spotlight(reaction);
	},
};
