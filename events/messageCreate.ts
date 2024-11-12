import { ChannelType, Events, Message } from "discord.js";
import { Event } from "../handlers/types.ts";

export const event: Event = {
  name: Events.MessageCreate,
  once: false,
  async handle(message: Message) {
    if (message.author.bot) return;
    switch (message.channel.type) {
      case ChannelType.GuildText: {
        if (message.content.startsWith("!ping")) {
          await message.channel.send("Pong!");
        }
        break;
      }
      case ChannelType.DM:
        handleDM(message);
        break;
      case ChannelType.PublicThread:
      case ChannelType.PrivateThread:
    }
  },
};

function handleDM(_message: Message) {
}
