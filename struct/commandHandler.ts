import {
  Collection,
  InteractionContextType,
  PermissionFlagsBits,
} from "discord.js";
import { logger } from "../util/log.ts";
import type { Command } from "./types.ts";

export class CommandHandler {
  public commands: Collection<string, Command>;

  constructor() {
    this.commands = new Collection();
    this.registerCommands();
  }

  private async registerCommands() {
    const path = "./commands";
    const folders = Deno.readDir(path);
    for await (const folder of folders) {
      const files = Deno.readDir(`${path}/${folder.name}`);
      for await (const file of files) {
        const { command } = await import(
          `${path}/${folder.name}/${file.name}`
        ) as {
          command: Command;
        };

        if (!("data" in command && "execute" in command)) {
          logger.warn(
            `[WARNING] The command at ${path}/${folder.name}/${file.name} is missing a required "data" or "execute" property.`,
          );
          continue;
        }

        command.category = folder.name;
        if (
          folder.name === "staff" && !command.data.default_member_permissions
        ) {
          // Limit staff commands to users with at least kick member perms
          command.data.setDefaultMemberPermissions(
            PermissionFlagsBits.KickMembers,
          );
        }

        // command.data.dm_permission ?? command.data.setContexts(InteractionContextType.Guild);
        command.data.contexts?.includes(InteractionContextType.Guild) ??
          command.data.setContexts(InteractionContextType.Guild);

        this.commands.set(command.data.name, command);
      }
    }

    return this.commands;
  }
}
