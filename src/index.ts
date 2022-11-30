import { Client as DiscordClient, GatewayIntentBits as Intents, ActivityType } from 'discord.js';
import { CommandHandler } from "./struct/commandHandler";
import { EventHandler } from "./struct/eventHandler";
import type { Client } from './struct/types';
import "dotenv/config";


const client = new DiscordClient({
    intents: [Intents.Guilds],
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

client.login(process.env.DISCORD_TOKEN);