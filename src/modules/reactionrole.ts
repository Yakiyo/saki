import { type MessageReaction, type User } from 'discord.js';
import { log } from '../util';

export async function reactionRole(reaction: MessageReaction, user: User) {
    const { prisma } = global;
    
    const rr = await prisma.reactionroles.findFirst({
        where: {
            reaction: reaction.emoji.id || reaction.emoji.name || undefined,
            message: reaction.message.id
        }
    });

    // We prolly dont have any reaction roles in that message with that reaction
    if (!rr) return;
    
    const role = await reaction.message.guild?.roles.fetch(rr.role).catch(e => {
        log(e);
        return null;
    });

    if (!role) return;

    const member = await reaction.message.guild?.members.fetch(user).catch(e => {
        if (e.code !== 50007) log(e); // error code 50007 means user doesnt have dms open, so we ignore it
        return;
    });

    if (!member) return;

    try {
        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role.id);
            await user.send(`> Removed role **${role.name}**!`).catch(log);
        } else {
            await member.roles.add(role.id);
            await user.send(`> Added role **${role.name}**!`).catch(log);
        }
    } catch (e) {
        log(e);
    } finally {
        await reaction.users.remove(user.id).catch(log);
    }
    
}