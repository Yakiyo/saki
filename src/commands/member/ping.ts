import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../struct/types';
import { dateTimestamp } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction) {
		const sent = await interaction.deferReply({
			fetchReply: true,
		});
		// await interaction.editReply(
		// 	`:ping_pong: Pong!\nUptime: ${Math.round(
		// 		interaction.client.uptime / 60000,
		// 	)} minutes\nWebsocket heartbeat: ${interaction.client.ws.ping}ms.\nRountrip Latency: ${
		// 		sent.createdTimestamp - interaction.createdTimestamp
		// 	}ms`,
		// );
		await interaction.editReply({
			embeds: [
				{
					color: 16102651,
					title: ':ping_pong: Pong!',
					description:
						`\n**Online since:** ${dateTimestamp(interaction.client.readyAt)}` +
						`\n**Websocket heartbeat:** ${interaction.client.ws.ping}ms` +
						`\n**Roundtrip Latency:** ${sent.createdTimestamp - interaction.createdTimestamp}ms`,
				},
			],
		});
	},
};
