import { SlashCommandBuilder, type TextChannel } from 'discord.js';
import { Command } from '../../struct/types';
import c from '../../config';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('affiliate')
		.setDescription('Affiliate a new discord server.')
		.addStringOption((option) =>
			option.setName('invite').setDescription('The invite link to the server').setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('description')
				.setDescription('A description of the server')
				.setRequired(true)
				.setMaxLength(2000)
		),
	async execute(interaction) {
		await interaction.deferReply();

		const invite = await interaction.client
			.fetchInvite(interaction.options.getString('invite') as string)
			.catch(() => null);
		if (!invite) {
			interaction.editReply('Invalid invite link. Please provide a valid one');
			return;
		}

		if (invite.expiresTimestamp) {
			interaction.editReply("Not a permanent invite. Please provide one that doesn't expire");
			return;
		}
		const channel = await interaction.client.channels
			.fetch(c.channels.affiliate)
			.then((c) => c)
			.catch(() => null);
		if (!channel) {
			interaction.editReply('Internal error. Could not find affiliates channel');
			return;
		}
		await (channel as TextChannel).send({
			embeds: [
				{
					color: 16027660,
					thumbnail: {
						url: invite.guild?.iconURL() as string,
					},
					title: invite.guild?.name,
					url: `https://discord.gg/${invite.code}`,
					description: interaction.options.getString('description') as string | undefined,
				},
			],
		});
		interaction.editReply(`Successfully added server to <#${c.channels.affiliate}>`);
		return;
	},
};
