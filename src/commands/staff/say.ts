import {
	SlashCommandBuilder,
	ChannelType as CT,
	type GuildTextBasedChannel,
	type GuildMember,
} from 'discord.js';
import type { Command } from '../../struct/types';
import { sendLog } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Make the bot say something')
		.addStringOption((option) =>
			option.setName('message').setDescription('string to send').setRequired(true),
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('Select a channel to send the message in (optional)')
				.addChannelTypes(CT.GuildText, CT.PublicThread, CT.PrivateThread),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const sentence = interaction.options.getString('message') as string;
		const channel = (interaction.options.getChannel('channel') ||
			interaction.channel) as GuildTextBasedChannel;

		const authorPerms = channel.permissionsFor(interaction.member as GuildMember);
		if (!authorPerms?.has('SendMessages')) {
			await interaction.reply({
				content: 'You do not have permission to send message in the target channel',
				ephemeral: true,
			});
			return;
		}

		const message = await channel.send(`${sentence}`);

		sendLog({
			author: {
				name: interaction.user.tag,
				icon_url: interaction.user.avatarURL() as string | undefined,
			},
			color: 16762880,
			title: 'Say Command used',
			description: `Sent in <#${message?.channelId}> | [Jump Link](${message?.url})`,
			timestamp: message?.createdAt.toISOString(),
		});

		interaction.editReply({ content: 'Message Successfully sent!' });
	},
};
