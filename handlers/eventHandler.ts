import { Client } from "discord.js";
import { Event } from "./types.ts";
import { log } from "../util/log.ts";

export class EventHandler {
  constructor(client: Client) {
    this.init(client);
  }

  private async init(client: Client) {
    const path = "./events";
    const folder = Deno.readDir(path);

    for await (const file of folder) {
      const { event } = await import(`${path}/${file.name}`) as {
        event: Event;
      };

      if (event.once) {
        client.once(event.name, (...args) => {
          try {
            event.handle(...args);
          } catch (error) {
            log(`Exception when handling event ${event.name}`, error);
          }
        });
        continue;
      }

      client.on(event.name, (...args) => {
        try {
          event.handle(...args);
        } catch (error) {
          log(`Exception when handling event ${event.name}`, error);
        }
      });
    }
  }
}
