import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Sends link to Gimai Seikatsu YouTube channel.'),
	async execute(interaction) {
		interaction.reply(
			"**YouTube Channel:**\n<https://www.youtube.com/channel/UCOQyW7GmCyTKwjCJEaTBWRw>.\n**English Subbed Episodes:**\n<https://bit.ly/gimaiyoutube>",
		);
	},
};
