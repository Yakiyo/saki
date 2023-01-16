import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder().setName('resume').setDescription('Resume the stream'),
	async execute(interaction) {
		await interaction.deferReply();
		distube.resume(interaction.guildId as string);
		interaction.editReply({
			embeds: [
				{
					color: 16105148,
					description: 'Resumed Music',
				},
			],
		});
	},
};
