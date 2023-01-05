import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import type { Command } from '../../struct/types';
import { log, rand } from '../../util';

const subs = ['memes', 'animememes'];

export const command: Command = {
	data: new SlashCommandBuilder().setName('meme').setDescription('Random meme'),
	async execute(interaction) {
		await interaction.deferReply();
		const isEnabled = await prisma.modules
			.findUnique({
				where: {
					id: 1,
				},
			})
			.then((v) => v?.Memes);

		if (!isEnabled) {
			interaction.editReply('Memes are disabled at the moment, sorry.');
			return;
		}
		const memes = await fetch(
			`https://reddit.com/r/${subs[rand(0, 1)]}.json?limit=100&sort=new`
		)
			.then((v) => v.json())
			.then((v) => v.data.children)
			.then((v) => v.map((d: Record<string, string>) => d.data))
			.then((v) => v.filter((a: Record<string, string>) => a.post_hint === 'image'))
			.catch((e) => {
				log(e);
				return null;
			});

		if (!memes) {
			interaction.editReply(
				'Unexpected error when making api requests. Please try again later'
			);
			return;
		}
		const meme = memes[rand(0, memes.length)];

		interaction.editReply({
			embeds: [
				{
					title: meme.title ?? 'Unknown title',
					url: `https://reddit.com${meme.permalink}`,
					author: {
						name: meme.author,
					},
					image: {
						url: meme.url_overridden_by_dest,
					},
					color: 16729344,
					footer: {
						text: `⬆️ ${meme.ups} | ⬇️ ${meme.downs}`,
					},
				},
			],
		});
	},
};
