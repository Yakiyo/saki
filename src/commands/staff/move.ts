import { SlashCommandBuilder, ChannelType as CT, GuildTextBasedChannel } from 'discord.js';
import type { Command } from '../../struct/types';
import { sendLog } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Make saki tell users to move to another channel')
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel to tell users to move to')
				.setRequired(true)
				.addChannelTypes(CT.GuildText, CT.PublicThread, CT.PrivateThread),
		),
	async execute(interaction) {
		const c = interaction.options.getChannel('channel');

		if (interaction.channel?.isSendable) return;

		const message = await (interaction.channel as GuildTextBasedChannel | null)?.send({
			embeds: [
				{
					color: 16762880,
					description: `Hey, let's continue this discussion in <#${c?.id}>`,
				},
			],
		});

		sendLog({
			author: {
				name: interaction.user.tag,
				icon_url: interaction.user.displayAvatarURL() as string | undefined,
			},
			color: 16762880,
			title: 'Move Command used',
			description: `Sent in <#${message?.channelId}> | [Jump Link](${message?.url})`,
			timestamp: message?.createdAt.toISOString(),
		});

		interaction.reply({
			content: 'done',
			ephemeral: true,
		});
	},
};
