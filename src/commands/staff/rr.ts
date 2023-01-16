import { ChannelType as CT, GuildTextBasedChannel, Role, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { log } from '../../util';

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
		)
		.addSubcommand((sub) =>
			sub.setName('show').setDescription('Show all reaction roles registered'),
		),
	async execute(interaction) {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'add': {
				const role = interaction.options.getRole('role') as Role;

				if (role.id === interaction.guildId) {
					interaction.editReply(
						'Provided role is the everyone role. Everyone role cannot be used in reaction roles',
					);
					return;
				}
				if (role.managed) {
					interaction.editReply(
						'Provided role is a role managed by an external bot or integration or discord. Cannot use those in reaction roles.',
					);
					return;
				}
				if (role.comparePositionTo(interaction.guild?.members.me?.roles.highest as Role) > 0) {
					interaction.editReply(
						'Provided role is higher than me. Either give me a higher role or make the role lower',
					);
					return;
				}
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
				await prisma.reactionroles.create({
					data: {
						message: message.id,
						channel: channel.id,
						role: role.id,
						reaction: emoji.id ?? emoji.name,
					},
				});
				interaction.editReply('Successfully created reaction role!');
				return;
			}

			case 'remove': {
				const role = interaction.options.getRole('role') as Role;
				const msgId = interaction.options.getString('message') as string;
				const prev = await prisma.reactionroles.findFirst({
					where: {
						message: msgId,
						role: role.id,
					},
				});
				if (!prev) {
					interaction.editReply('No reaction role with that role in the message exists');
					return;
				}
				const channel = (await interaction.guild?.channels.fetch(prev.channel).catch((e) => {
					log(e);
					return null;
				})) as GuildTextBasedChannel | null;

				// If channel exists, we attempt to remove the reaction. Otherwise just skip it and
				// remove the reaction role entry from the database
				if (channel) {
					const message = await channel.messages.fetch(prev.message);
					const reaction = message.reactions.resolve(prev.reaction);
					if (!reaction) break;
					reaction.users.remove(interaction.client.user.id).catch(log);
				}
				await prisma.reactionroles
					.delete({
						where: {
							id: prev.id,
						},
					})
					.catch(log);

				interaction.editReply('Successfully removed reaction role from database');
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
