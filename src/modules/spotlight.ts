import type { APIEmbed, GuildTextBasedChannel, TextChannel, MessageReaction } from 'discord.js';
import config from '../config';
import { log } from '../util';

const IGNORED_CHANNELS = [
	'803683562225139714', // #reddit
	'805487789855997962', // #twitter
	'803686892612354149', // #youtube
	'806107156780548107', // #gimai-info
	'803178486943711263', // #gimai-updates
	'808340739451912221', // #suggestions
	'808156905771630622', // #server-announcements
	'805753936048685096', // #friends
	'804733433724272651', // #info-and-roles
	'808067819118919750', // #rules
	'806943445179564042', // #mod-admin-discussion
	'834105875999752212', // #spotlight
	'809005257971204106', // #template
	'808067819118919751', // #discord-announcements
	'803700644023500840', // #activity-log
	'803609876886585365', // #staff-bot
	'803594943561859072', // #staff-chat
	'863805630241177640', // #gimai-ln-v4-raws
	'865485989095145472', // #gimai-manga-raws
];

const MIN_REACTIONS = 7;

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

	const channel = (await client.channels
		.fetch(config.channels.spotlight)
		.catch(log)) as GuildTextBasedChannel | null;
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
	await prisma.spotlights.create({
		data: {
			message: message.id,
			source: reaction.message.id,
			channel: reaction.message.channelId,
		},
	});
	return;
}
