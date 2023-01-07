import { SlashCommandBuilder } from 'discord.js';
import { Client, Command } from '../../struct/types';
// import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import config from '../../config';
import { log } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a slash commands. Dev only :)')
		.addStringOption((option) =>
			option.setName('command').setDescription('The command to reload').setRequired(true),
		),
	async execute(interaction) {
		if (!config.owners.includes(interaction.user.id)) {
			interaction.reply({
				content: 'Dev only command. Cannot be accessed by others',
				ephemeral: true,
			});
			return;
		}
		await interaction.deferReply({ ephemeral: true });
		const command = (interaction.client as Client).commandHandler.commands.get(
			interaction.options.getString('command') as string,
		);
		if (!command) {
			interaction.editReply(
				'Did not find any command with that name. Please provide a valid command',
			);
			return;
		}
		const path = join(__dirname, '..', '..', 'commands');

		const filePath = resolve(process.cwd(), `${path}/${command.category}/${command.data.name}`);
		delete require.cache[require.resolve(filePath)];
		try {
			const { command: reloaded } = require(filePath) as {
				command: Command;
			};
			reloaded.category = command.category;
			(interaction.client as Client).commandHandler.commands.set(reloaded.data.name, reloaded);
			return await interaction.editReply(`Command ${reloaded.data.name} was successfully reloaded`);
		} catch (error) {
			log(error);
			return await interaction.editReply('Something went wrong');
		}
	},
};
