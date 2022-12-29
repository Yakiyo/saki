import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('reddit')
		.setDescription('Sends link to Gimai Seikatsu subreddit.'),
	async execute(interaction) {
		interaction.reply(
			"Here's the link to the **Subreddit** <https://www.reddit.com/r/GimaiSeikatsu/>."
		);
	},
};
