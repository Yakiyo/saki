import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../struct/types';
import { sendLog } from '../../util';

const rules = [
	{
		title: '0. __Discord ToS__',
		desc: "- Follow [Discord's Terms of Service](https://discord.com/terms) and [Discord's Community Guidelines](https://discord.com/guidelines).",
	},
	{
		title: '1. __Be respectful__',
		desc: '- Always be respectful to other members.\n- Do not insult or harass, toxic behavior will not be tolerated.',
	},
	{
		title: '2. __Avoid off-topic__',
		desc: '- Keep conversations in their respective channels.\n- Read the channel description as it contains instructions on what is considered on-topic as well as specific channel rules.\n- Keep off-topic to the bare minimum.',
	},
	{
		title: '3. __Do not spam__',
		desc: '- Do not spam emotes, images or single word messages.',
	},
	{
		title: '4. __Advertising__',
		desc: "- Don't self-promote or advertise without asking a staff member first.",
	},
	{
		title: '5. __Spoiler Policy__',
		desc: "- Keep spoilers in the spoiler channel and mark plot-heavy spoilers with Discord's spoiler tagging method.",
	},
	{
		title: '6. __NSFW__',
		desc: "- Keep NSFW content in the R18+ channels.\n- If you're unsure if an image or video is NSFW, post it in the NSFW channel.\n- No loli or shota NSFW!",
	},
];

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('rule')
		.setDescription("Display rule number 'n'")
		.addNumberOption((option) =>
			option
				.setName('number')
				.setDescription('The rule number to display')
				.setMinValue(0)
				.setMaxValue(6)
				.setRequired(true)
		),
	async execute(interaction) {
		const int = interaction.options.getNumber('number') as number;
		const rule = rules[int];

		const message = await interaction.channel?.send({
			content: `Hey, you are probably violating rule ${int}, consider removing or editing that message or moderators might have to take an action.`,
			embeds: [
				{
					author: {
						name: 'Rule violation',
						icon_url:
							'https://cdn.discordapp.com/attachments/483063348792000513/808132429297876992/alert.png',
					},
					color: 16762880,
					fields: [
						{
							name: rule.title,
							value: rule.desc,
						},
					],
				},
			],
		});

		sendLog({
			author: {
				name: interaction.user.tag,
				icon_url: interaction.user.avatarURL() as string | undefined,
			},
			color: 16762880,
			title: 'Rule Command used',
			description: `Sent in <#${message?.channelId}> | [Jump Link](${message?.url})`,
			timestamp: message?.createdAt.toISOString(),
		});

		interaction.reply({
			content: 'Sent!',
			ephemeral: true,
		});
	},
};
