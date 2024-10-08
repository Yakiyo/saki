import type {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ClientEvents,
	Client as DiscordClient,
	SlashCommandSubcommandsOnlyBuilder,
	SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { type CommandHandler } from './commandHandler';

export interface Event<Name extends keyof ClientEvents = keyof ClientEvents> {
	readonly name: Name;
	readonly once?: boolean;
	handle(...args: unknown[]): unknown;
}

export interface Client extends DiscordClient<true> {
	commandHandler: CommandHandler;
}

type CommandData =
	| SlashCommandBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| SlashCommandOptionsOnlyBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export interface Command {
	readonly data: CommandData;
	category?: string;
	execute(interaction: ChatInputCommandInteraction): unknown;
}

export interface Job {
	readonly name: string;
	interval: number; // This should be in seconds, always!
	id?: ReturnType<typeof setInterval>;
	run(): Promise<void>;
	init(): void;
	stop(): void;
}
