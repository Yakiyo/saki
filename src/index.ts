import {
	Client as DiscordClient,
	GatewayIntentBits as Intents,
	ActivityType,
	Partials,
} from 'discord.js';
import { CommandHandler } from './struct/commandHandler';
import { EventHandler } from './struct/eventHandler';
import { PrismaClient } from '@prisma/client';
import type { Client } from './struct/types';
import 'dotenv/config';
import { log } from './util';
import { Module } from './struct/module';

const prisma = new PrismaClient();
(async () => {
	try {
		await prisma.$connect();
	} catch (e) {
		log(e);
		await prisma.$disconnect();
		process.exit(1);
	}
})();

const client = new DiscordClient({
	intents: [
		Intents.Guilds,
		Intents.GuildMembers,
		Intents.GuildMessages,
		Intents.GuildMessageReactions,
	],
	partials: [Partials.Message, Partials.Reaction, Partials.Channel],
	presence: {
		status: 'online',
		activities: [
			{
				name: 'Lofi Music',
				type: ActivityType.Listening,
			},
		],
	},
}) as Client;

client.commandHandler = new CommandHandler();
new EventHandler(client);

if (process.env.DEPLOY === 'TRUE') {
	require('./deploy');
}

declare global {
	var client: Client;
	var prisma: PrismaClient;
	var modules: Module;
}

global.client = client;
global.prisma = prisma;

global.modules = new Module();

client.login(process.env.DISCORD_TOKEN);
