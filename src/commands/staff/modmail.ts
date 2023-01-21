import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { log } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('modmail')
		.setDescription('Group of commands for modmail')
		.addSubcommand((sub) =>
			sub
				.setName('open')
				.setDescription('Start a new modmail with a user')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user to start the modmail with')
						.setRequired(true),
				),
		)
		.addSubcommand((sub) => sub.setName('close').setDescription('Close an existing modmail')),
	async execute(interaction) {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'open': {
				return;
			}

			case 'close': {
				return;
			}

			default: {
				log(interaction);
				interaction.editReply('Unknown subcommand received. please report this to the dev');
				return;
			}
		}
	},
};
