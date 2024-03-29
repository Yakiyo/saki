import { type Guild, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music player and disconnects bot from vc'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = distube.getQueue(interaction.guildId as string);
		if (!queue) {
			interaction.editReply({
				embeds: [
					{
						description:
							'No song in the queue at the moment. Use `/play` to add music to the queue.',
					},
				],
			});
			return;
		}
		await distube.stop(interaction.guild as Guild);
		distube.voices.get(interaction.guildId as string)?.leave();
		interaction.editReply({
			embeds: [
				{
					color: 16105148,
					title: 'Stopped Stream',
					description: 'Closed connection and left voice channel.',
				},
			],
		});
	},
};
