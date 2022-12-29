import {
	SlashCommandBuilder,
	ChannelType as CT,
	type GuildTextBasedChannel,
	User,
	type Message,
} from 'discord.js';
import type { Command } from '../../struct/types';
import { log, sendLog } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('spoiler')
		.setDescription('Re-sends the message with spoiler tags.')
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('Id of the message to spoiler')
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel where the message is from')
				.addChannelTypes(CT.GuildText, CT.PublicThread, CT.PrivateThread)
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const channel = (interaction.options.getChannel('channel') ||
			interaction.channel) as GuildTextBasedChannel;
		const message = await channel.messages
			.fetch({
				message: interaction.options.getString('message') as string,
				force: true,
			})
			.catch(() => null);

		if (!message) {
			interaction.editReply(
				'No message with that id found. Please use a valid message id or provide channel id'
			);
			return;
		}

		const files = [];
		for (const [_, attachment] of message.attachments) {
			attachment.name = 'SPOILER_' + attachment.name;
			files.push(attachment);
		}
		if (!message.attachments.size && !files.length) {
			interaction.editReply('The message does not have any attachment to spoiler');
			return;
		}
		let sent: Message<true>;
		try {
			sent = await channel.send({
				files,
				embeds: [
					{
						description: message.content,
						footer: {
							text: `Message sent by ${message.member?.user.tag}`,
							icon_url: (message.member?.user as User).avatarURL({
								extension: 'png',
								forceStatic: true,
							}) as string | undefined,
						},
					},
				],
			});
		} catch (e) {
			log(e);
			interaction.editReply(
				'Unexpected error while sending spoilered message.\n' +
					'Possible reasons: too large files, too many attachments'
			);
			return;
		}

		sendLog({
			author: {
				name: interaction.user.tag,
				icon_url: interaction.user.avatarURL() as string | undefined,
			},
			color: 16762880,
			title: 'Spoiler Command used',
			description: `Sent in <#${sent?.channelId}> | [Jump Link](${sent?.url})`,
			timestamp: sent?.createdAt.toISOString(),
		});
		interaction.editReply('done');
	},
};
