import {
  ChatInputCommandInteraction,
  Collection,
  InteractionContextType,
  PermissionFlagsBits,
  REST,
  Routes,
} from "discord.js";
import { log, logger } from "../util/log.ts";
import type { Command } from "./types.ts";
import kv from "../util/kv.ts";
import { shorten } from "../util/misc.ts";

export class CommandHandler {
  public commands: Collection<string, Command>;

  constructor() {
    this.commands = new Collection();
    this.registerCommands();
  }

  /**
   * Deploys interactions to discord
   */
  public async registerInteractions(global: boolean) {
    const rest = new REST().setToken(Deno.env.get("DISCORD_TOKEN")!);
    const route = global
      ? Routes.applicationCommands(kv.client.get()!)
      : Routes.applicationGuildCommands(kv.client.get()!, kv.guild.get()!);

    console.info(
      `Started refreshing ${this.commands.size} application commands`,
    );

    try {
      await rest.put(route, {
        body: this.commands.map((command) => command.data.toJSON()),
      });
    } catch (error) {
      console.error("Failed to register application commands.", error);
      return;
    }

    console.info("Successfully registered application (/) commands.");
  }

  public async handleCommand(interaction: ChatInputCommandInteraction) {
    const command = this.commands.get(interaction.commandName);
    if (!command) return;

    try {
      command.execute(interaction);
    } catch (error) {
      log(
        `Failed to execute command ${command.data.name} in response to interactin`,
        error,
      );

      const content = `Internal error when executing the command!\n\`\`\` ${
        shorten(
          `${error}`,
          500,
        )
      }\`\`\` `;

      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
          content,
        });
      } else {
        await interaction.reply({
          content,
          ephemeral: true,
        });
      }
    }
  }

  /**
   * Loads commands from file system into a map
   */
  private async registerCommands() {
    const path = "./commands";
    const folders = Deno.readDir(path);
    for await (const folder of folders) {
      const files = Deno.readDir(`${path}/${folder.name}`);
      for await (const file of files) {
        const { command } = await import(
          `../${path}/${folder.name}/${file.name}`
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
