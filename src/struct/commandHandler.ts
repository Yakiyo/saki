import { Collection, type GuildMember, type ChatInputCommandInteraction } from 'discord.js';
import { join, resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';
import { type Command } from './types';
import config from '../config';
import { isStaff, log } from '../util';
const { clientId, guildId } = config;

export class CommandHandler {
	commands: Collection<string, Command>;

	constructor() {
		this.commands = new Collection();
		this.registerCommands();
	}

	public async registerInteractions(asGlobal: boolean = false) {
		const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);
		const commands = this.commands.map((v) => v.data.toJSON());
		const route = asGlobal !== true ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			await rest.put(route, {
				body: commands,
			});

			console.log(`Successfully reloaded application (/) commands.`);
		} catch (error) {
			log(error);
		}
	}

	public async handleCommand(interaction: ChatInputCommandInteraction) {
		const command = this.commands.get(interaction.commandName);
		if (!command) return;
		try {
			if (command.category === 'staff' && !isStaff(interaction.member as GuildMember)) {
				interaction.reply({
					content: 'Staff only command. Inaccessible for you.',
					ephemeral: true,
				});
				return;
			}
			await command.execute(interaction);
		} catch (e) {
			log(e);
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({
					content: 'Internal error when executing the command!',
				});
			} else {
				await interaction.reply({
					content: 'Internal error when executing the command!',
					ephemeral: true,
				});
			}
		}
	}

	private async registerCommands() {
		const path = join(__dirname, '..', 'commands');
		const folders = readdirSync(path);
		for (const folder of folders) {
			const files = readdirSync(`${path}/${folder}`).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
			for (const file of files) {
				const { command } = require(resolve(process.cwd(), `${path}/${folder}/${file}`)) as {
					command: Command;
				};
				if (!('data' in command) || !('execute' in command)) {
					console.warn(`[WARNING] The command at ${path}/${folder}/${file} is missing a required "data" or "execute" property.`);
					continue;
				}
				command.category = folder;
				this.commands.set(command.data.name, command);
			}
		}
		return this.commands;
	}
}
