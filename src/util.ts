import { type GuildMember } from "discord.js";
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