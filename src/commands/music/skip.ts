import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current song'),
	async execute(interaction) {
		await interaction.deferReply();
		const e = await distube
			.skip(interaction.guildId as string)
			.then(() => null)
			.catch((e) => (e.errorCode === 'NO_UP_NEXT' ? 1 : null));
		if (e === 1) {
			interaction.editReply('No song to skip. This is the last song playing');
			return;
		}
		interaction.editReply('Skipped current song');
	},
};
