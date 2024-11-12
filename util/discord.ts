import { GuildMember, TimestampStylesString } from "discord.js";
import kv from "./kv.ts";

/**
 * Simple function that converts a date object to discord timestamp
 *
 * More at: https://discord.com/developers/docs/reference#message-formatting
 */
export const dateTimestamp = (d: Date, type: TimestampStylesString = "R") =>
  `<t:${Math.ceil(d.getTime() / 1000)}:${type}>`;

export function isStaff(member: GuildMember): boolean {
  const modId = kv.roles.get("mod");
  // if no modId is set, we default to false
  if (!modId) return false;
  member.fetch();
  return member.roles.cache.has(modId);
}
