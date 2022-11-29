import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../struct/types";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Sends link to Gimai Seikatsu MangaDex page.'),
    async execute(interaction) {
        interaction.reply("Here's the link to the **MangaDex** page\n<https://mangadex.org/title/99daf7bc-3a3b-4fe8-b10d-951b32bfea64>.");
    },
}