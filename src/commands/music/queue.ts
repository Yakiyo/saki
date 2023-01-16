import { type APIEmbed, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder().setName('queue').setDescription('Show current music queue'),
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
		const embed: APIEmbed = {
			title: '🎧 Current Queue',
			description: queue.songs
				.map(
					(song, id) => `**${id ? id : 'Playing'}**. ${song.name} - \`${song.formattedDuration}\``,
				)
				.slice(0, 10)
				.join('\n'),
			color: 16105148,
		};
		if (queue.songs.length > 10) {
			embed.footer = {
				text: `Showing 10 out of ${queue.songs.length} songs.`,
			};
		}
		interaction.editReply({
			embeds: [embed],
		});
	},
};
