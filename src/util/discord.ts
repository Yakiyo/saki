import type {
	GuildMember,
	APIEmbed,
	JSONEncodable,
	TextChannel,
	TimestampStylesString,
} from 'discord.js';
import config from '../config';
import { log } from './logger';

/**
 * If a member is staff or not
 */
export const isStaff = (member: GuildMember) => member.roles.cache.has(config.roles.mod);

/**
 * Log a message to activity/mod logs channel
 */
export async function sendLog(
	payload: string | APIEmbed | JSONEncodable<APIEmbed>,
	destination: LogDestination = LogDestination.activity,
) {
	const cid =
		destination === LogDestination.activity
			? config.channels.activity_log
			: config.channels.mod_log;
	const channel = (await client.channels.fetch(cid).catch(() => null)) as TextChannel | null;
	if (!channel) {
		log(`Error when fetching ${LogDestination[destination]} logs`);
		return;
	}
	if (typeof payload === 'string') {
		channel.send(payload);
	} else {
		channel.send({
			embeds: [payload],
		});
	}
}

/**
 * Simple function that converts a date object to discord timestamp
 *
 * More at: https://discord.com/developers/docs/reference#message-formatting
 */
export const dateTimestamp = (d: Date, type: TimestampStylesString = 'R') =>
	`<t:${Math.ceil(d.getTime() / 1000)}:${type}>`;

/**
 * Enums for log channels
 */
export enum LogDestination {
	activity,
	mod,
}
