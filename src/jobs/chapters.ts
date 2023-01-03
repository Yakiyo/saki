import { Collection, GuildTextBasedChannel } from 'discord.js';
import config from '../config';
import { type Job } from '../struct/types';
import fetch from 'node-fetch';
import { log } from '../util';

export const job: Job = {
	name: 'Chapters',
	interval: 60,
	async run() {
		const { client, prisma } = global;

		const isEnabled = await prisma.modules
			.findUnique({
				where: {
					id: 1,
				},
			})
			.then((m) => m?.Chapters);

		// Do not run if job is not initiated
		if (!isEnabled) return;

		const chaps = await getChaps();

		// Theres no chaps to publish, so we skip
		if (!chaps.size) return;

		let str =
			`<@!${config.roles.ln}> :green_book:\n` +
			'New Gimai Seikatsu translation is up by CClaw Translations! ' +
			'Discussion in <#803894436027301958> only.\n\n';

		for (const [k, v] of chaps) {
			str += `**${k.replace('Gimai Seikatsu', '')}:** <${v}>\n\n`;
		}
		str += 'Do share some love with our Fan Translator!';

		const channel = (await client.channels
			.fetch(config.channels.updates)
			.catch(() => null)) as GuildTextBasedChannel | null;
		channel
			?.send(str)
			.then((message) => message.crosspost())
			.catch(log);
	},
	async init() {
		this.id = setInterval(this.run, this.interval * 1000);
	},
};

/**
 * Scrap chaps from cclaw website. This returns only recent 10 (?) chapters
 * from the feeds.
 */
async function getChaps() {
	const { prisma } = global;

	const chaps = await prisma.cache
		.findUnique({
			where: {
				id: 1,
			},
		})
		.then((c) => c?.chapter);

	const v = await fetch('https://cclawtranslations.home.blog/feed/')
		.then((v) => v.text())
		.catch((e) => {
			log(e);
			return null;
		});

	const map = new Collection<string, string>();
	if (!v) return map;
	const titles = v.split('<title>').reverse();
	const links = v.split('<link>').reverse();

	for (let i = 0; i < titles.length; i++) {
		const title = titles[i].split('</title>')[0];
		const link = links[i].split('</link>')[0];
		if (!title.toLowerCase().includes('gimai seikatsu')) continue;

		if (chaps?.filter((x) => x.link === link).length !== 0) continue; // it was already released, so we skip this iteration
		map.set(title, link);
	}

	const arr: { link: string }[] = [];
	map.forEach((v) => arr.push({ link: v }));
	await prisma.cache
		.update({
			where: {
				id: 1,
			},
			data: {
				chapter: {
					push: arr,
				},
			},
		})
		.catch(log);
	return map;
}
