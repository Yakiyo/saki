import type { APIEmbed, GuildTextBasedChannel, MessageReaction } from 'discord.js';
import config from '../config';
import { log } from '../util';

const MIN_REACTIONS = 7;

export async function spotlight(reaction: MessageReaction) {
	if (!reaction.message.guild) return;
	const reactions = reaction.message.reactions.cache;

	const users = new Set<string>();
	for (const r of reactions.values()) {
		r.users.cache.filter((u) => !u.bot).forEach((e) => users.add(e.id));
	}

	if (Array.from(users).length < MIN_REACTIONS) return;

	const prev = await prisma.spotlights.findFirst({
		where: {
			source: reaction.message.id,
			channel: reaction.message.channelId,
		},
	});

	if (prev) return; // A spotlight entry for that message already exists, so we don't bother with it

	const channel = (await client.channels.fetch(config.channels.spotlight).catch((e) => {
		log(e);
		return null;
	})) as GuildTextBasedChannel | null;
	if (!channel) return;

	const embed: APIEmbed = {
		color: 16762880,
		author: {
			name: reaction.message.member?.user.username as string,
			icon_url: reaction.message.member?.user.displayAvatarURL({ size: 1024 }),
		},
		timestamp: new Date().toISOString(),
		footer: {
			text: '⭐ Starred',
		},
		description: reaction.message.content as string | undefined,
		fields: [
			{
				name: 'Source',
				value: `[Jump Link](${reaction.message.url})`,
			},
		],
	};
	if (reaction.message.attachments.size) {
		embed.image = {
			url: reaction.message.attachments.first()?.url as string,
		};
	}
	const message = await channel
		.send({
			content: `<#${reaction.message.channelId}>`,
			embeds: [embed],
		})
		.catch(log);
	if (!message) return;
	await prisma.spotlights
		.create({
			data: {
				message: message.id,
				source: reaction.message.id,
				channel: reaction.message.channelId,
			},
		})
		.then(console.log);
	return;
}
