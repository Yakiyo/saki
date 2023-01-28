import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { fetch } from 'undici';
import { log } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder().setName('fact').setDescription('Sends a random Maaya fact'),
	async execute(interaction) {
		await interaction.deferReply();
		const fact = await fetch('https://nekos.life/api/v2/fact')
			.then((res) => res.json() as Promise<Record<string, string>>)
			.then((res) => res.fact)
			.catch(log);

		if (!fact) {
			interaction.editReply('Unexpected error. Could not fetch result for api.');
			return;
		}
		interaction.editReply({
			embeds: [
				{
					color: 0,
					description: fact,
				},
			],
		});
	},
};
