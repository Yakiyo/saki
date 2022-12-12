import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../struct/types";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import config from "../../config";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a slash commands. Dev only :)')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload')
                .setRequired(true)),
    async execute(interaction) {
        if (!config.owners.includes(interaction.user.id)) {
            interaction.reply({ content: "Dev only command. Cannot be accessed by others", ephemeral: true });
            return;
        }
        await interaction.deferReply({ ephemeral: true });
        // @ts-ignore
        const command = interaction.client.commandHandler.commands.get(interaction.options.getString("command"));
        if (!command) {
            interaction.editReply("Did not find any command with that name. Please provide a valid command");
            return;
        }
        const path = join(__dirname, '..', '..' , 'commands');

        let folder: string | undefined;
        if (command.category) {
            folder = command.category;
        } else {
            const commandFolders = readdirSync(path);
            folder = commandFolders.find(subfolder => readdirSync(`${path}/${subfolder}`).filter(x => x == `${command.data.name}.js` || x == `${command.data.name}.ts`));
            command.category = folder;
        }
        const filePath = resolve(process.cwd(), `${path}/${folder}/${command.data.name}`);
        delete require.cache[require.resolve(filePath)];
        try {
            const { command: reloaded } = require(filePath) as { command: Command };
            // @ts-ignore
            interaction.client.commandHandler.commands.set(reloaded.data.name, reloaded);
            return await interaction.editReply(`Command ${reloaded.data.name} was successfully reloaded`);
        } catch (error) {
            console.error(error);
            return await interaction.editReply('Something went wrong');
        }
    },
}