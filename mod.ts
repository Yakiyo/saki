import {
  ActivityType,
  Client,
  GatewayIntentBits as Intents,
  Partials,
} from "discord.js";
import { CommandHandler } from "./handlers/commandHandler.ts";
import { EventHandler } from "./handlers/eventHandler.ts";

export const client = new Client({
  intents: [
    Intents.Guilds,
    Intents.GuildMembers,
    Intents.GuildMessages,
    Intents.MessageContent,
    Intents.DirectMessages,
    Intents.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.Channel],
  presence: {
    status: "online",
    activities: [
      {
        name: "Lofi Music",
        type: ActivityType.Listening,
      },
    ],
  },
});

export const commandHandler = await new CommandHandler().registerCommands();
export const eventHandler = new EventHandler(client);
