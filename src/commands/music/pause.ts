import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder().setName('pause').setDescription('Pause the stream'),
	async execute(interaction) {
		await interaction.deferReply();
		distube.pause(interaction.guildId as string);
		interaction.editReply('Paused stream');
	},
};
