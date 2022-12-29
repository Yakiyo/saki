import { Client as DiscordClient, GatewayIntentBits as Intents, ActivityType } from 'discord.js';
import { CommandHandler } from './struct/commandHandler';
import { EventHandler } from './struct/eventHandler';
import { PrismaClient } from '@prisma/client';
import type { Client } from './struct/types';
import 'dotenv/config';
import { log } from './util';

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
	intents: [Intents.Guilds, Intents.GuildMembers, Intents.GuildMessages],
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
}

global.client = client;
global.prisma = prisma;

client.login(process.env.DISCORD_TOKEN);
