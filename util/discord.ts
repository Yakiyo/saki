import { TimestampStylesString } from "discord.js";

/**
 * Simple function that converts a date object to discord timestamp
 *
 * More at: https://discord.com/developers/docs/reference#message-formatting
 */
export const dateTimestamp = (d: Date, type: TimestampStylesString = "R") =>
  `<t:${Math.ceil(d.getTime() / 1000)}:${type}>`;
