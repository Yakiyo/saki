import {
  ActivityType,
  Client,
  GatewayIntentBits as Intents,
  Partials,
} from "discord.js";

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
