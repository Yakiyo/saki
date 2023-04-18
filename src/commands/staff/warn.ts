import { Colors, SlashCommandBuilder, type User } from 'discord.js';
import type { Command } from '../../struct/types';
import { log, sendLog } from '../../util';

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
		const target = interaction.options.getUser('user') as User;
		await interaction.deferReply({ ephemeral: true });
		switch (interaction.options.getSubcommand()) {
			case 'add': {
				const reason = interaction.options.getString('reason') as string;
				const count = await prisma.warn.count();
				await prisma.warn.create({
					data: {
						id: count + 1,
						target: target.id,
						moderator: interaction.user.id,
						reason,
					},
				});
				sendLog({
					title: `Warn Case #${count + 1}`,
					color: Colors.Blurple,
					description: `**Offender:** ${target.id} | <@!${target.id}>\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`,
				});
				target
					.send({
						embeds: [
							{
								description: `You have been warned from **Gimai Seikatsu** server.\n**Reason:** ${reason}`,
								color: Colors.Blurple,
							},
						],
					})
					.catch(log);
				interaction.editReply(`Succesfully warned **${target.username}**`);
				return;
			}

			case 'remove': {
				interaction.editReply('Not implemented yet!');
				return;
			}
		}
	},
};
