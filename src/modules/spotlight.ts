import type { APIEmbed, GuildTextBasedChannel, TextChannel, MessageReaction } from 'discord.js';
import config from '../config';
import { log } from '../util';

const IGNORED_CHANNELS = [
	'804733433724272651',
	'805753936048685096',
	'808156905771630622',
	'803178764153389068',
	'834105875999752212',
	'803178486943711263',
	'806107156780548107',
	'803683562225139714',
	'805487789855997962',
	'803686892612354149',
	'863805630241177640',
];

const MIN_REACTIONS = 2;

export async function spotlight(reaction: MessageReaction) {
	if (!reaction.message.guild) return;
	if (
		IGNORED_CHANNELS.includes(reaction.message.channelId) ||
		(reaction.message.channel as TextChannel).nsfw
	)
		return;
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
