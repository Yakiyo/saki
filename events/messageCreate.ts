import { ChannelType, Events, Message } from "discord.js";
import { Event } from "../handlers/types.ts";
// import kv from "../util/kv.ts";

export const event: Event = {
  name: Events.MessageCreate,
  once: false,
  async handle(message: Message) {
    if (message.author.bot) return;
    // const modmail = kv.channels.get("modmail");
    switch (message.channel.type) {
      case ChannelType.GuildText: {
        if (message.content.startsWith("!")) {
          await message.channel.send("Pong!");
        }
        break;
      }
      case ChannelType.DM:
      case ChannelType.PublicThread:
      case ChannelType.PrivateThread:
    }
  },
};
