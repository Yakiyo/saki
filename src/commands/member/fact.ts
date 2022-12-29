import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import fetch from 'node-fetch';
import { log } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder().setName('fact').setDescription('Sends a random Maaya fact'),
	async execute(interaction) {
		await interaction.deferReply();
		const fact: string | null = await fetch('https://nekos.life/api/v2/fact')
			.then((res) => res.json())
			.then((res) => res.fact)
			.catch((e) => {
				log(e);
				return null;
			});

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
