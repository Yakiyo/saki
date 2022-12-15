import type { GuildMember,  APIEmbed , JSONEncodable, TextChannel } from "discord.js";
import config from "./config";

/**
 * If a member is staff or not
 */
export function isStaff(member: GuildMember) {
    return member.roles.cache.has(config.roles.mod);
}

/**
 * Shorten a string upto num length
 */
export function shorten(str: string, num = 1000): string | undefined {
    if (typeof str !== 'string') return undefined;
    if (str.length > num) {
        return str.substring(0, num + 1) + '...';
    } else {
        return str;
    }
}

/**
 * Coverts the first character of the string to uppercase and the rest to lowercase
 */
export function casify(string: string) {
    if (typeof string !== 'string') return 'null';

    return string.split(/_/g).map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');

}

/**
 * Log a message to activity/mod logs channel
 */
export async function sendLog(payload: string | APIEmbed | JSONEncodable<APIEmbed>, destination: LogDestination = LogDestination.activity) {
    // @ts-ignore
    const client = globalThis.client;
    const cid = destination == LogDestination.activity ? config.channels.activity_log : config.channels.mod_log;
    const channel = await client.channels.fetch(cid).catch((e) => {
        console.error(e);
        return null;
    }) as TextChannel | null;
    if (!channel) {
        console.error(`Error when fetching ${LogDestination[destination]} logs`);
        return;
    }
    if (typeof payload == 'string') {
        channel.send(payload);
    } else {
        channel.send({
            embeds: [payload]
        });
    }
}

/**
 * Enums for log channels
 */
export enum LogDestination {
    activity,
    mod
}
