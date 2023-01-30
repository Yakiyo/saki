import { ChannelType, GuildTextBasedChannel, SlashCommandBuilder } from 'discord.js';
import { clean, log } from '../../util';
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
		)
		.addSubcommand((sub) =>
			sub
				.setName('delete')
				.setDescription('delete a message')
				.addStringOption((option) =>
					option.setName('message').setDescription('the message to delete').setRequired(true),
				)
				.addChannelOption((option) =>
					option.setName('channel').setDescription('The channel to delete'),
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
			case 'delete': {
				const channel = (interaction.options.getChannel('channel') ??
					interaction.channel) as GuildTextBasedChannel;

				const m = await channel.messages.fetch(interaction.options.getString('message') as string);
				if (!m.deletable) {
					interaction.editReply('cannot delete the message');
					return;
				}
				await m.delete().catch(log);
				interaction.editReply('done');
				return;
			}

			default: {
				interaction.editReply('Unknown subcommand received');
				return;
			}
		}
	},
};
