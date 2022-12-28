import type { Event, Client } from '../struct/types';
import {
	Events,
	type Interaction,
	InteractionType,
	type ChatInputCommandInteraction,
} from 'discord.js';

export const event: Event = {
	name: Events.InteractionCreate,
	async handle(interaction: Interaction, client: Client) {
		switch (interaction.type) {
			case InteractionType.ApplicationCommand: {
				await client.commandHandler.handleCommand(
					interaction as ChatInputCommandInteraction
				);
				break;
			}
		}
	},
};
