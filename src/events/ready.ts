import type { Event } from '../struct/types';
import { Events } from 'discord.js';

export const event: Event = {
	name: Events.ClientReady,
	once: true,
	async handle() {
		console.log(`Ready and logged in as ${client.user.tag}`);
	},
};
