import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('web')
		.setDescription(
			'Sends link to the Gimai Seikatsu Fan English TL online website.'
		),
	async execute(interaction) {
		interaction.reply(
			"Here's the link for the **Light Novel EN TL on CClaw**\n<https://cclawtranslations.home.blog/gimai-seikatsu-toc/>."
		);
	},
};
