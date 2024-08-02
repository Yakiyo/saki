import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('pdf2')
		.setDescription('Sends link to the Gimai Seikatsu Fan english TL ePUB/PDF'),
	async execute(interaction) {
		const c = client.commandHandler.commands.get('epub2') as Command;
		c.execute(interaction);
	},
};
