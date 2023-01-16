import { ChannelType as CT, GuildTextBasedChannel, Role, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('rr')
		.setDescription('Commands for managing reaction roles')
		.addSubcommand((sub) =>
			sub
				.setName('add')
				.setDescription('Add a reaction role to a message')
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('The role to use in the reaction role')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('emoji')
						.setDescription('The emoji to use for the reaction role')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('message')
						.setDescription('The message to which the reaction role should be added')
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('Optional channel where the message is. Defaults to current channel')
						.addChannelTypes(CT.GuildText, CT.PublicThread, CT.PrivateThread),
				)
				.addStringOption((option) =>
					option
						.setName('type')
						.setDescription('The type of reaction role. Defaults to NORMAL')
						.addChoices({ name: 'NORMAL', value: 'NORMAL' }, { name: 'VERIFY', value: 'VERIFY' }),
				),
		)
		.addSubcommand((option) =>
			option
				.setName('remove')
				.setDescription('Remove a reaction role')
				.addStringOption((option) =>
					option
						.setName('message')
						.setDescription('The id of message containing the reaction role')
						.setRequired(true),
				)
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('The role used in the reaction role')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'add': {
				const role = interaction.options.getRole('role') as Role;
				const emoji =
					(await interaction.guild?.emojis.fetch(
						interaction.options.getString('emoji') as string,
					)) ?? null;
				if (!emoji) {
					interaction.editReply('No emoji with that id/name found in the server');
					return;
				}
				const channel = (interaction.options.getChannel('channel') ??
					interaction.channel) as GuildTextBasedChannel;
				const message =
					(await channel.messages.fetch(interaction.options.getString('message') as string)) ||
					null;
				if (!message) {
					interaction.editReply(
						`Could not find any message with id **${interaction.options.getString(
							'message',
						)}** channel ${channel.id}`,
					);
					return;
				}
				const prev = await prisma.reactionroles.findFirst({
					where: {
						message: message.id,
						channel: channel.id,
						role: role.id,
						reaction: emoji.id ?? emoji.name,
					},
				});
				if (prev) {
					interaction.editReply(
						'A reaction role on that message with that role and emoji already exists. Please remove the old one before adding the new one',
					);
					return;
				}
				message.react(emoji);
				await prisma.reactionroles
					.create({
						data: {
							message: message.id,
							channel: channel.id,
							role: role.id,
							reaction: emoji.id ?? emoji.name,
						},
					})
					.then(console.log);
				interaction.editReply('Successfully created reaction role!');
				return;
			}

			case 'remove': {
				interaction.editReply('Unimplemented!');
				return;
			}

			default: {
				interaction.editReply(
					'Unimplemented subcommand received. Please report this to the developer',
				);
				return;
			}
		}
	},
};
