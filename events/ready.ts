import type { Event } from "../handlers/types.ts";
import { Events } from "discord.js";
import { logger } from "../util/log.ts";

export const event: Event = {
  name: Events.ClientReady,
  once: true,
  handle() {
    logger.info("Bot is ready!");
  },
};
