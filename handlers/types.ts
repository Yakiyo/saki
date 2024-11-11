import type {
  ChatInputCommandInteraction,
  ClientEvents,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface Event<Name extends keyof ClientEvents = keyof ClientEvents> {
  readonly name: Name;
  readonly once?: boolean;
  handle(...args: unknown[]): unknown;
}

type CommandData =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

export interface Command {
  readonly data: CommandData;
  category?: string;
  execute(interaction: ChatInputCommandInteraction): void;
}

export interface Job {
  readonly name: string;
  interval: number; // This should be in seconds, always!
  id?: ReturnType<typeof setInterval>;
  run(): Promise<void>;
  init(): void;
  stop(): void;
}
