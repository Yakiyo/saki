import type { Event } from '../struct/types';
import { Events, MessageReaction, User, type Client } from 'discord.js';
import { log } from '../util';
import { reactionRole } from '../modules/reactionrole';

export const event: Event = {
	name: Events.MessageReactionAdd,
	once: false,
	async handle(reaction: MessageReaction, user: User, _client: Client<true>) {
        // if the message isnt cached, fetch it first.
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (e) {
                log(e);
                return;
            }
        }

        const { prisma } = global;

        const isRREnabled = await prisma.modules.findUnique({
            where: {
                id: 1
            }
        }).then(m => m?.Reaction_Roles);

        if (isRREnabled) {
            reactionRole(reaction, user);
        }
	},
};