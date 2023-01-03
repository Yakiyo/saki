import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
const { version } = require('../../../package.json') as { version: string };
import fetch from 'node-fetch';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Information about the bot'),
	async execute(interaction) {
		await interaction.deferReply();
		const commits = await fetch(
			'https://api.github.com/repos/Yakiyo/saki/commits?per_page=5'
		)
			.then(async (response) => {
				const json = await response.json();
                return response.ok ? json : Promise.reject(json);
			})
			.then((res) => res);

		const arr = [];
		for (const commit of commits) {
			const message =
				commit.commit.message.indexOf('\n') !== -1
					? commit.commit.message.substring(
							0,
							commit.commit.message.indexOf('\n')
					  )
					: commit.commit.message;

			const string =
				`[\`${commit.sha.substring(0, 7)}\`](${commit.html_url})` +
				` ${message} - ${commit.commit.author.name}`;

			arr.push(string);
		}
		const embed = {
			color: 16102651,
			footer: {
				text: 'Made with 💖 & discord.js',
				icon_url: 'https://i.imgur.com/U4U2cPU.png',
				proxy_icon_url:
					'https://images-ext-1.discordapp.net/external/CMaZlkTJ__mjsFwpDAFFiJen1GnEd7SI56dOcgoAXu8/https/i.imgur.com/U4U2cPU.png',
			},
			title: `Saki bot V-${version}`,
			description:
				'Discord bot for Gimai Seikatsu discord server.\n\nThe bot supports slash commands. To get started, use `/help`\n\nDiscord: https://discord.gg/WQspAHcJHB\nSubreddit: [r/GimaiSeikatsu](https://www.reddit.com/r/GimaiSeikatsu/)\nFandom: [Gimai Fandom](https://gimai-seikatsu.fandom.com/wiki/Gimai_Seikatsu_Wiki)',
			fields: [
				{
					name: 'Language',
					value: '[Typescript](typescriptlang.org/)',
					inline: true,
				},
				{
					name: 'Library',
					value: '[Discord.js](https://discord.js.org/)',
					inline: true,
				},
				{
					name: 'Github',
					value: '[Link](https://github.com/Yakiyo/saki)',
					inline: true,
				},
				{
					name: 'Recent Changes',
					value: arr.join('\n'),
				},
			],
		};

		interaction.editReply({
			embeds: [embed],
		});
	},
};
