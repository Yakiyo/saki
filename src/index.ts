import { Client as DiscordClient, GatewayIntentBits as Intents, ActivityType } from 'discord.js';
import { CommandHandler } from "./struct/commandHandler";
import { EventHandler } from "./struct/eventHandler";
import type { Client } from './struct/types';
import { DisTube } from 'distube';
import { log } from './util';
import "dotenv/config";

const client = new DiscordClient({
    intents: [
        Intents.Guilds,
        Intents.GuildMembers
    ],
    presence: {
        status: 'online',
        activities: [{
            'name': 'Lofi Music',
            'type': ActivityType.Listening,
        }],
    },
}) as Client;

client.commandHandler = new CommandHandler();
new EventHandler(client);

if (process.env.DEPLOY === 'TRUE') {
    require("./deploy");
}

const distube = new DisTube(client, {
    searchSongs: 5,
    searchCooldown: 30,
    leaveOnEmpty: false,
	leaveOnFinish: false,
	leaveOnStop: false,
    joinNewVoiceChannel: true
});

client.on('error', log);
distube.on('error', log);

declare global {
    var client: Client;
    var distube: DisTube;
}

global.client = client;
global.distube = distube;

client.login(process.env.DISCORD_TOKEN);