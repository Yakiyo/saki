import { type GuildTextBasedChannel, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../struct/types";
import config from "../../config";
import { log } from "../../util";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('release_yt')
        .setDescription('Sends YouTube VN Release ping on updates channel.')
        .addStringOption(option =>
            option.setName("link")
                .setDescription("The link to the video to send")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("title")
                .setDescription("The title of the video")
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const title = interaction.options.getString("title");
        const link = interaction.options.getString("link");
        const channel = await interaction.client.channels
            .fetch(config.channels.updates)
            .catch(() => null);

        if (!channel) {
            interaction.editReply("Could not find updates channel.");
            return;
        }
        
        const message = await (channel as GuildTextBasedChannel).send(`<@&808757223244300311>
Gimai Seikatsu's new YouTube VN with English subtitle is up! Discussion in <#806366264457035786> only.


**Title:** ${title}
**Youtube Link:** ${link}

**Official Playlist:** <https://bit.ly/gimaiyoutube>`);

    await message.crosspost()
        .catch(log);

    interaction.editReply("Announcement posted!");
    return;

    },
}