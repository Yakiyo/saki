import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { log } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current song'),
	async execute(interaction) {
		await interaction.deferReply();
		const e = await distube
			.skip(interaction.guildId as string)
			.then(() => null)
			.catch((e) => {
				if (e.errorCode === 'NO_UP_NEXT') return 1;
				else {
					return log(e);
				}
			});
		if (e) {
			interaction.editReply({
				embeds: [
					{
						description: 'No song to skip. This is the last song playing',
					},
				],
			});
			return;
		}
		interaction.editReply({
			embeds: [
				{
					color: 16105148,
					description: 'Skipped Current Song',
				},
			],
		});
	},
};
