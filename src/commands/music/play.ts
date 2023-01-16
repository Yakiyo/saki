import { GuildMember, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song')
		.addStringOption((option) =>
			option.setName('song').setDescription('The song to play').setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();
		const query = interaction.options.getString('song') as string;

		const vc = (interaction.member as GuildMember)?.voice?.channel;
		if (!vc) {
			interaction.editReply('Please join a vc before playing a song.');
			return;
		}
		const song = await distube
			.search(query, {
				limit: 1,
			})
			.then((v) => v[0])
			.catch(() => null);

		if (!song) {
			interaction.editReply(`No song with the query **${query}** found`);
			return;
		}

		await distube.play(vc, song);
		interaction.editReply({
			embeds: [
				{
					color: 16105148,
					title: 'Added Music',
					description: `Added [${song.name}](${song.url}) to queue`,
				},
			],
		});
	},
};
