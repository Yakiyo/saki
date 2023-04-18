import { SlashCommandBuilder, User } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a server member')
		.addSubcommand((sub) =>
			sub
				.setName('add')
				.setDescription('Add a warning to a user')
				.addUserOption((option) =>
					option.setName('user').setDescription('The user to warn').setRequired(true),
				)
				.addStringOption((option) =>
					option.setName('reason').setDescription('Reason for warning').setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('remove')
				.setDescription('Remove one or all warnings from a user')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user whose warn(s) to remove')
						.setRequired(true),
				)
				.addNumberOption((option) =>
					option
						.setName('id')
						.setDescription('An id of a warning to remove. If empty, all warnings are removed'),
				),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user') as User;
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'add': {
				console.log(user);
				interaction.editReply('Not implemented yet!');
				return;
			}

			case 'remove': {
				interaction.editReply('Not implemented yet!');
				return;
			}
		}
	},
};
