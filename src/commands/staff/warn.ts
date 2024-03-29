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
				.addNumberOption((option) =>
					option
						.setName('id')
						.setDescription('An id of a warning to remove. If empty, all warnings are removed')
						.setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('list')
				.setDescription('List all warnings of a user')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user whose warnings to show')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('user') as User;
		if (target?.bot) {
			interaction.reply({
				ephemeral: true,
				content: 'Cannot add/remove/list warn for bots',
			});
			return;
		}
		switch (interaction.options.getSubcommand()) {
			case 'add': {
				await interaction.deferReply({ ephemeral: true });
				const reason = interaction.options.getString('reason') as string;
				const count =
					(await prisma.warn
						.findFirst({
							orderBy: {
								id: 'desc',
							},
						})
						.then((m) => m?.id)
						.catch(log)) ?? 1;
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
				// const len = await prisma.warn.findMany({
				// 	where: {
				// 		target: target.id,
				// 	}
				// }).then(m => m.length);
				// if (len === 2) {

				// }
				return;
			}

			case 'remove': {
				await interaction.deferReply({ ephemeral: true });
				const id = interaction.options.getNumber('id') as number;
				const warn = await prisma.warn.findFirst({
					where: {
						id,
					},
				});
				if (!warn) {
					interaction.editReply(`No warn with id #${id} exists`);
					return;
				}
				await prisma.warn
					.delete({
						where: {
							id,
						},
					})
					.catch(log);
				sendLog({
					title: `Warn Remove #${warn.id}`,
					color: Colors.Blurple,
					description: `Warn case #${warn.id} removed by <@${interaction.user.id}>`,
				});
				interaction.editReply(`Deleted warn entry #${id}`);
				return;
			}

			case 'list': {
				await interaction.deferReply();
				const warns = await prisma.warn
					.findMany({
						where: {
							target: target.id,
						},
					})
					.catch(log);
				if (!warns?.length) {
					interaction.editReply('The user has no warns!');
					return;
				}

				interaction.editReply({
					embeds: [
						{
							color: Colors.Blurple,
							title: `${warns.length} warnings found`,
							author: {
								name: target.tag,
								icon_url: target.displayAvatarURL(),
							},
							fields: warns.map((warn) => ({
								inline: true,
								name: `#${warn.id} | ${warn.createdAt.toDateString()}`,
								value: `**Moderator:** <@${warn.moderator}>\n**Reason:** ${warn.reason}`,
							})),
						},
					],
				});
				return;
			}
		}
	},
};
