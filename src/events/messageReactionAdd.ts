import type { Event } from '../struct/types';
import { Events, MessageReaction, User, type Client } from 'discord.js';
import { log } from '../util';

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

        console.log(`Reaction ${reaction}, user: ${user}`)
	},
};