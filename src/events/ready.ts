import type { Event } from "../struct/types";
import { Events, type Client } from 'discord.js';

export const event: Event = {
    name: Events.ClientReady,
    once: true,
    async handle(client: Client<true>) {
        console.log(`Ready and logged in as ${client.user.tag}`);
    },
};
