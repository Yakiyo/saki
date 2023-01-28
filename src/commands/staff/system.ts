import { SlashCommandBuilder } from 'discord.js';
import { clean } from '../../util';
import config from '../../config';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('system')
		.setDescription('Set of developer only commands')
		.addSubcommand((sub) =>
			sub
				.setName('eval')
				.setDescription('Super awesome eval command')
				.addStringOption((option) =>
					option.setName('code').setDescription('The code to evaluate').setRequired(true),
				),
		),
	async execute(interaction) {
		if (!config.owners.includes(interaction.user.id)) {
			interaction.reply({
				content: 'Owner only command. You cannot use this',
				ephemeral: true,
			});
			return;
		}
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'eval': {
				let cleaned;
				try {
					const evaled = eval(interaction.options.getString('code') as string);
					cleaned = await clean(evaled);
					await interaction.editReply(`\`\`\`js\n${cleaned}\n\`\`\``);
				} catch (error) {
					await interaction.editReply(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
				}
				return;
			}

			default: {
				interaction.editReply('Unknown subcommand received');
				return;
			}
		}
	},
};
