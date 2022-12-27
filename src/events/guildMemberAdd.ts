import type { Event } from "../struct/types";
import { Events, type GuildMember, type Client } from 'discord.js';
import config from "../config";
import { log } from "../util";
import { welcome } from "../modules/welcome";

export const event: Event = {
    name: Events.GuildMemberAdd,
    async handle(member: GuildMember, client: Client<true>) {        
        /**
         * Assign Member role to users on join
         */
        if (!member.user.bot) {
            member.roles.add(config.roles.member).catch(log);
        }


        // TODO: Check if welcome module is enabled or not from db
        if (!member.user.bot) {
            welcome(member, client);
        }

        

    },
};
