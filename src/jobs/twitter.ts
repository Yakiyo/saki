import { Job } from '../struct/types';
import fetch from 'node-fetch';
import { log } from '../util';
import config from '../config';
import { GuildTextBasedChannel } from 'discord.js';

export const job: Job = {
	name: 'Twitter',
	interval: 15 * 60,
	async run() {
		const gimai_id = '1250594468262113280';
		const res: string[] | null = await fetch(
			`https://api.twitter.com/2/users/${gimai_id}/tweets?max_results=5`,
			{
				headers: {
					Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
				},
			},
		)
			.then(async (v) => await v.json())
			.then((v) => v.data)
			.then((v) =>
				v.map((r: Record<string, string>) => `https://twitter.com/gimaiseikatsu/status/${r.id}`),
			)
			.catch((e) => {
				log(e);
				return null;
			});

		if (!res?.length) return;
		const feeds = await prisma.cache
			.findUnique({
				where: {
					id: 1,
				},
			})
			.then((c) => c?.twitter);

		const links = [];
		for (const link of res) {
			if (feeds?.filter((v) => v.link === link).length) continue;
			links.push({
				link,
			});
		}
		if (!links.length) return;
		await prisma.cache.update({
			where: {
				id: 1,
			},
			data: {
				twitter: {
					push: links,
				},
			},
		});
		const channel = await client.channels.fetch(config.channels.feeds.twitter).catch((e) => {
			log(e);
			return null;
		});

		if (!channel) return;
		(channel as GuildTextBasedChannel).send(
			links
				.map((l) => l.link)
				.reverse()
				.join('\n'),
		);
	},
	init() {
		this.id = setInterval(this.run, this.interval * 1000);
	},
	stop() {
		clearInterval(this.id);
		this.id = undefined;
	},
};
