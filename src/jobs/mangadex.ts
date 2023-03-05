import { GuildTextBasedChannel } from 'discord.js';
import config from '../config';
import type { Job } from '../struct/types';
import { log } from '../util';
import { fetch } from 'undici';

export const job: Job = {
	name: 'Mangadex',
	interval: 5 * 60,
	async run() {
		const res = (await fetch(
			'https://api.mangadex.org/manga/99daf7bc-3a3b-4fe8-b10d-951b32bfea64/feed?limit=5&order[publishAt]=desc',
		)
			.then((v) => v.json())
			.catch(log)) as MangadexResponse | null;
		if (!res?.data.length) return;
		const chaps = res.data;
		const feeds = await prisma.cache
			.findUnique({
				where: {
					id: 1,
				},
			})
			.then((c) => c?.mangadex);
		const finals = [];
		for (const chap of chaps) {
			const link = `https://mangadex.org/chapter/${chap.id}`;
			if (chap.relationships?.find(rel => rel.type === 'scanlation_group')?.id !== '6b27f0ac-8ed1-45af-a24a-1a4246ec6305') continue;
			if (feeds?.filter((x) => x.link === link).length !== 0) continue;
			finals.push({
				link,
				chapter: chap.attributes.chapter,
			});
		}
		if (!finals.length) return;

		const channel = (await client.channels
			.fetch(config.channels.updates)
			.catch(log)) as GuildTextBasedChannel | null;
		if (!channel) return;
		channel
			.send(
				`<@&${config.roles.manga}>\n\nGimai Seikatsu Chapter ${finals
					.map((v) => `**${v.chapter}**`)
					.join(', ')} has been released! Discussion in <#819954330546733086> only.` +
					`\n\n${finals.map((v) => v.link).join('\n\n')}`,
			)
			.then((m) => m.crosspost().catch(log));

		await prisma.cache
			.update({
				where: {
					id: 1,
				},
				data: {
					mangadex: {
						push: finals.map((v) => ({ link: v.link })),
					},
				},
			})
			.catch(log);
	},
	init() {
		this.id = setInterval(this.run, this.interval * 1000);
	},
	stop() {
		clearInterval(this.id);
		this.id = undefined;
	},
};

interface MangadexResponse {
	result: string;
	response: 'collection';
	data: ChapterEntry[];
	limit: number;
	offset: number;
	total: number;
}

interface ChapterEntry {
	id: '99daf7bc-3a3b-4fe8-b10d-951b32bfea64';
	type: 'chapter';
	attributes: {
		title: string;
		volume: string;
		chapter: string;
		pages: number;
		translatedLanguage: string;
		uploader: string;
		externalUrl: string;
		version: number;
		createdAt: string;
		updatedAt: string;
		publishAt: string;
		readableAt: string;
	};
	relationships: [
		{
			id: string;
			type: string;
			related: string;
			attributes: {};
		},
	];
}
