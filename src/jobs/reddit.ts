import { Job } from '../struct/types';
import { fetch } from 'undici';
import config from '../config';
import { APIEmbed, GuildTextBasedChannel } from 'discord.js';
import { log } from '../util';

export const job: Job = {
	name: 'Reddit',
	interval: 5 * 60,
	async run() {
		const embeds = await fetch('https://www.reddit.com/r/GimaiSeikatsu/new.json?sort=new&limit=10')
			.then((v) => v.json())
			.then((v) => (v as Record<string, any>).data.children.reverse())
			.then((v) => v.map((d: Record<string, string>) => d.data))
			.then(iterate)
			.catch(log);

		if (!embeds) return;
		const channel = (await client.channels
			.fetch(config.channels.feeds.reddit)
			.catch(log)) as GuildTextBasedChannel | null;
		if (!channel) return;

		for (const embed of embeds) {
			await channel
				.send({
					embeds: [embed],
				})
				.catch((e) => {
					log(e);
				});
		}
	},
	async init() {
		this.id = setInterval(this.run, this.interval * 1000);
	},
	async stop() {
		clearInterval(this.id);
		this.id = undefined;
	},
};

/**
 * Convert a reddit post object to a discord embed
 */
function embedify(post: Record<string, string>) {
	const embed: APIEmbed = {
		thumbnail: {
			url: 'https://cdn.discordapp.com/attachments/483063348792000513/824691215319826512/reddit-logo-16.png',
		},
		color: 16729344,
		timestamp: new Date().toISOString(),
		footer: {
			text: 'Published',
		},
		author: {
			name: post.author,
		},
		title: post.title ?? 'Unknown title',
		url: `https://reddit.com${post.permalink}`,
		description: post.selftext || post.url || `https://reddit.com${post.permalink}`,
	};

	return embed;
}

/**
 * Iterate over the post objects returned from reddit
 */
async function iterate(posts: Record<string, string>[]) {
	const feeds = await prisma.cache
		.findUnique({
			where: {
				id: 1,
			},
		})
		.then((c) => c?.reddit);
	const res = [];
	const links = [];
	for (const post of posts) {
		const link = `https://reddit.com${post.permalink}`;
		if (post.over_18) continue; // we skip nsfw content
		if (feeds?.filter((v) => v.link === link).length) continue;
		links.push({
			link,
		});
		res.push(embedify(post));
	}
	await prisma.cache.update({
		where: {
			id: 1,
		},
		data: {
			reddit: {
				push: links,
			},
		},
	});
	return res;
}
