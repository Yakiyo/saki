import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('pdf')
		.setDescription('Sends link to the Gimai Seikatsu Fan english TL ePUB/PDF'),
	async execute(interaction) {
		const c = client.commandHandler.commands.get('epub') as Command;
		c.execute(interaction);
	},
};
