import {
	ChannelType as CT,
	Collection,
	GuildEmoji,
	GuildTextBasedChannel,
	Role,
	SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../../struct/types';
import { log, parseEmoji } from '../../util';
import {} from '@prisma/client';

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
		.addSubcommand((sub) =>
			sub
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
			sub.setName('list').setDescription('Show all reaction roles registered'),
		),
	async execute(interaction) {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case 'add': {
				const role = interaction.options.getRole('role') as Role;
				const type = interaction.options.getString('type') as 'VERIFY' | 'NORMAL' | null;

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
				const emoji = await parseEmoji(interaction.options.getString('emoji') as string)
					.then((e) => (e instanceof GuildEmoji ? e.id : e))
					.catch(log);

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
						reaction: emoji,
					},
				});
				if (prev) {
					interaction.editReply(
						'A reaction role on that message with that role and emoji already exists. Please remove the old one before adding the new one',
					);
					return;
				}
				message.react(emoji).catch(log);
				await prisma.reactionroles.create({
					data: {
						message: message.id,
						channel: channel.id,
						role: role.id,
						reaction: emoji,
						type: type ?? undefined,
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
				const channel = (await interaction.guild?.channels
					.fetch(prev.channel)
					.catch(log)) as GuildTextBasedChannel | null;

				// If channel exists, we attempt to remove the reaction. Otherwise just skip it and
				// remove the reaction role entry from the database
				if (channel) {
					try {
						const message = await channel.messages.fetch(prev.message).catch(() => null);
						if (!message) throw 'skip';
						const reaction = message.reactions.resolve(prev.reaction);
						if (!reaction) throw 'skip';
						if (reaction.me) {
							reaction.users.remove(interaction.client.user.id);
						}
					} catch (e) {
						if (e !== 'skip') log(e);
					}
				}
				await prisma.reactionroles
					.delete({
						where: {
							id: prev.id,
						},
					})
					.catch(console.error);

				interaction.editReply('Successfully removed reaction role from database');
				return;
			}

			case 'list': {
				const emojis = interaction.client.emojis.cache;
				const rrs = await prisma.reactionroles.findMany();

				const messages = new Collection<string, Collection<string, string>>();
				for (const rr of rrs) {
					let emoji: GuildEmoji | string | undefined = emojis?.get(rr.reaction); //`<${emojis?.get(rr.reaction)?.identifier ?? rr.reaction}>`;

					if (emoji?.id) {
						if (emoji.animated) emoji = `<${emoji?.identifier}>`;
						else emoji = `<:${emoji?.identifier}>`;
					} else if (emoji?.name) emoji = emoji.name;
					else emoji = rr.reaction;

					const message = messages.get(rr.message);
					if (message) {
						message.set(emoji, `<@&${rr.role}>`);
					} else {
						messages.set(rr.message, new Collection<string, string>().set(emoji, `<@&${rr.role}>`));
					}
				}
				interaction.editReply({
					embeds: [
						{
							color: 16105148,
							title: 'Reaction Roles',
							fields: messages
								.map((c, d) => {
									return {
										name: d,
										value: c.map((v, k) => `${k} ${v}`).join('\n'),
										inline: true,
									};
								})
								.slice(0, 20),
						},
					],
				});
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
