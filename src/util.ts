import { type GuildMember } from "discord.js";
import config from "./config";

export function isStaff(member: GuildMember) {
    return member.roles.cache.has(config.roles.mod);
}