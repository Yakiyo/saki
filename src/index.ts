import 'dotenv/config';
import {
	Client as DiscordClient,
	GatewayIntentBits as Intents,
	ActivityType,
	Partials,
} from 'discord.js';
import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { PrismaClient } from '@prisma/client';
import { CommandHandler } from './struct/commandHandler';
import { EventHandler } from './struct/eventHandler';
import type { Client } from './struct/types';
import { log } from './util';
import { JobHandler } from './struct/jobHandler';

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
		Intents.GuildPresences,
		Intents.MessageContent,
		Intents.DirectMessages,
		Intents.GuildVoiceStates,
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

const distube = new DisTube(client, {
	searchSongs: 5,
	searchCooldown: 15,
	leaveOnEmpty: true,
	leaveOnFinish: true,
	leaveOnStop: false,
	plugins: [new YtDlpPlugin({ update: true })],
	youtubeCookie: process.env.YOUTUBE_COOKIE,
});

client.commandHandler = new CommandHandler();
new EventHandler(client);

if (process.env.DEPLOY === 'TRUE') {
	require('./deploy');
}

declare global {
	var client: Client;
	var prisma: PrismaClient;
	var distube: DisTube;
	var jobHandler: JobHandler;
}

global.client = client;
global.prisma = prisma;
global.distube = distube;
global.jobHandler = new JobHandler();

process.on('unhandledRejection', log);
client.on('error', (e) => {
	log(e);
});

client.login(process.env.DISCORD_TOKEN);
