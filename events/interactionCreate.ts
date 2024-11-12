import type { Event } from "../handlers/types.ts";
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Events,
  GuildMember,
  Interaction,
  InteractionType,
} from "discord.js";
import { commandHandler } from "../mod.ts";
import { isStaff } from "../util/discord.ts";

interface InteractionEvent extends Event {
  handleMessageComponent(interaction: ButtonInteraction): void;
}

export const event: InteractionEvent = {
  name: Events.InteractionCreate,
  once: false,
  handle(interaction: Interaction) {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        commandHandler.handleCommand(
          interaction as ChatInputCommandInteraction,
        );
        break;
      case InteractionType.MessageComponent:
        // for now, we only handle buttons
        if (!interaction.isButton()) return;
        this.handleMessageComponent(interaction);
        break;
    }
  },
  async handleMessageComponent(interaction) {
    if (!interaction.customId.startsWith("MOD")) return;
    if (!isStaff(interaction.member as GuildMember)) {
      await interaction.reply({
        content: "Mod only usage",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferUpdate();

    const _cid = interaction.customId.replace("MOD_", "");
  },
};
