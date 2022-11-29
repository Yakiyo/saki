import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../struct/types";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('epub')
        .setDescription('Sends link to the Gimai Seikatsu Fan english TL ePUB/PDF'),
    async execute(interaction) {
        interaction.reply("Here's the download link for the **Light Novel EN TL** <https://bit.ly/gimaiseikatsu>.");
    },
}