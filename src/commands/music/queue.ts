import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder().setName('queue').setDescription('Show current music queue'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction.guildId as string);
		if (!queue) {
			interaction.editReply('Nothing playing right now');
			return;
		}
		interaction.editReply(
			`Current queue:\n${queue.songs
				.map(
					(song, id) => `**${id ? id : 'Playing'}**. ${song.name} - \`${song.formattedDuration}\``,
				)
				.slice(0, 10)
				.join('\n')}`,
		);
	},
};
