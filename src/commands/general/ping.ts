import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../struct/types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		await interaction.editReply(`:ping_pong: Pong!\nUptime: ${Math.round(interaction.client.uptime / 60000)} minutes\nWebsocket heartbeat: ${interaction.client.ws.ping}ms.\nRountrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
}