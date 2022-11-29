import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../struct/types";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Sends link to the Gimai Seikatsu wiki'),
    async execute(interaction) {
        interaction.reply("Here's the link to the **Wiki**\n<https://gimai-seikatsu.fandom.com/wiki/Gimai_Seikatsu_Wiki>.");
    },
}