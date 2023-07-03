import { Job } from '../struct/types';
import { fetch } from 'undici';
import { log } from '../util';
import config from '../config';
import { GuildTextBasedChannel } from 'discord.js';

export const job: Job = {
	name: 'Twitter',
	interval: 15 * 60,
	async run() {
		const res = await fetch(
			'https://rsshub.app/twitter/user/gimaiseikatsu.json?limit=5&sorted=true',
		)
			.then((v) => v.json())
			.then((v) => (v as Record<string, any>).items as Record<string, string>[])
			.then((v) => v.map((f) => f.url))
			.catch(log);

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
		const channel = await client.channels.fetch(config.channels.feeds.twitter).catch(log);

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
