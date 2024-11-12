import { SlashCommandBuilder } from "discord.js";
import { dateTimestamp } from "../../util/discord.ts";
import { Command } from "../../handlers/types.ts";

export const command: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription(
    "Replies with Pong!",
  ),
  async execute(interaction) {
    const sent = await interaction.deferReply({
      fetchReply: true,
    });

    await interaction.editReply({
      embeds: [
        {
          color: 16102651,
          title: ":ping_pong: Pong!",
          description:
            `\n**Online since:** ${dateTimestamp(interaction.client.readyAt)}` +
            `\n**Websocket heartbeat:** ${interaction.client.ws.ping}ms` +
            `\n**Roundtrip Latency:** ${
              sent.createdTimestamp - interaction.createdTimestamp
            }ms`,
        },
      ],
    });
  },
};
