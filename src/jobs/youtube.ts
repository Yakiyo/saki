import { Job } from '../struct/types';
import { log } from '../util';
import config from '../config';
import { GuildTextBasedChannel } from 'discord.js';
import fetch from 'node-fetch';

export const job: Job = {
	name: 'Youtube',
	// Once every 15 mins
	interval: 15 * 60,
	async run() {
		const res: YoutubeResult = await fetch(
			`https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=UCOQyW7GmCyTKwjCJEaTBWRw&part=snippet,id&order=date&maxResults=1`,
		)
			.then((r) => r.json())
			.then((r) => r.items[0]);

		const link = `https://youtu.be/${res.id.videoId}`;
		const feeds = await prisma.cache
			.findUnique({
				where: {
					id: 1,
				},
			})
			.then((v) => v?.youtube);
		if (feeds?.filter((v) => v.link === link).length) return;
		prisma.cache
			.update({
				where: {
					id: 1,
				},
				data: {
					youtube: {
						push: {
							link,
						},
					},
				},
			})
			.catch(log);
		const channel = (await client.channels.fetch(config.channels.feeds.youtube).catch((e) => {
			log(e);
			return null;
		})) as GuildTextBasedChannel | null;

		if (!channel) return;
		await channel.send(
			"Gimai Seikatsu's new video is available on YouTube! :video_camera:" +
				`\n\n**Title:** ${res.snippet.title}` +
				`\n**Youtube Link:** ${link}`,
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

/**
 * A youtube result object returned from the api.
 *
 * This interface is just in case i ever need it in the future
 */
interface YoutubeResult {
	kind: 'youtube#searchResult';
	etag: string;
	id: {
		kind: 'youtube#video';
		videoId: string;
	};
	snippet: {
		publishedAt: string;
		channelId: 'UCOQyW7GmCyTKwjCJEaTBWRw';
		title: string;
		description: string;
		thumbnails: {
			default: {
				url: string;
				width: number;
				height: number;
			};
			medium: {
				url: string;
				width: number;
				height: number;
			};
			high: {
				url: string;
				width: number;
				height: number;
			};
		};
		channelTitle: '義妹生活';
		liveBroadcastContent: string;
		publishTime: string;
	};
}
