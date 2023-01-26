import { SlashCommandBuilder, type User } from 'discord.js';
import type { Command } from '../../struct/types';
import { log, closeMail, createMail } from '../../util';

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
		.addSubcommand((sub) =>
			sub
				.setName('close')
				.setDescription('Close an existing modmail')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user whose modmail to close')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		await interaction.deferReply({
			ephemeral: true,
		});
		const user = interaction.options.getUser('user') as User;
		const mail = await prisma.modmail.findFirst({
			where: {
				userId: user.id,
				isOpen: true,
			},
		});
		switch (interaction.options.getSubcommand()) {
			case 'open': {
				if (user.bot) {
					interaction.editReply('You cannot open a modmail with a bot user');
					return;
				}
				if (mail) {
					interaction.editReply(
						`A modmail for that user is already opened at <#${mail.threadId}>. Please use it or close that before opening a new one`,
					);
					return;
				}
				const success = user
					.send({
						embeds: [
							{
								color: 16105148,
								title: 'Modmail Open',
								description:
									'A modmail channel has been opened with you by the Gimai Seikatsu staff team for dicussing a topic.\nYou can send messages here to reply back to them.',
							},
						],
					})
					.then(() => true)
					.catch((e) => {
						if (e.code === 50007) {
							interaction.editReply(
								'Unable the send modmail reply. The user has their dms disabled for this server. Please tell them to enable it first!',
							);
							return false;
						}
						log(e);
						interaction.editReply('Unexpected error while trying to send modmail. Check logs');
						return false;
					});
				if (!success) return;
				await createMail(user, interaction.user.id);
				interaction.editReply('Successfully created modmail');
				return;
			}

			case 'close': {
				if (!mail) {
					interaction.editReply('No modmail for that user is currently opened.');
					return;
				}
				await closeMail(mail.threadId, interaction.user);
				interaction.editReply('Successfully closed modmail');
				return;
			}

			default: {
				log({
					message: 'Unknown subcommand received',
					...interaction,
				});
				interaction.editReply('Unknown subcommand received. please report this to the dev');
				return;
			}
		}
	},
};
