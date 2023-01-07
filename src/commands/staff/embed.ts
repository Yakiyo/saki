import {
	SlashCommandBuilder,
	ChannelType as CT,
	type GuildTextBasedChannel,
	Colors,
	type APIEmbed,
	type Embed,
} from 'discord.js';
import type { Command } from '../../struct/types';
import * as sourcebin from 'sourcebin';
import { log, shorten } from '../../util';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Command to create/edit discord embeds')
		.addSubcommand((sub) =>
			sub
				.setName('source')
				.setDescription('Gets raw JSON for a discord embed')
				.addStringOption((option) =>
					option
						.setName('message')
						.setDescription('The id of the message whose embed to fetch')
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('Channel where the message is situated')
						.addChannelTypes(CT.GuildText, CT.PublicThread, CT.PrivateThread),
				)
				.addIntegerOption((option) =>
					option
						.setName('number')
						.setDescription('The number of the embed to fetch from the message')
						.setMaxValue(10)
						.setMinValue(1),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('create')
				.setDescription('create a simple discord embed')
				.addStringOption((option) =>
					option
						.setName('description')
						.setDescription("the embed's description section")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option.setName('title').setDescription("the embed's title section"),
				)
				.addStringOption((option) =>
					option.setName('color').setDescription("the embed's color section"),
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('the channel to send the embed to')
						.addChannelTypes(
							CT.GuildText,
							CT.GuildNews,
							CT.GuildNewsThread,
							CT.GuildPublicThread,
							CT.GuildPrivateThread,
						),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('custom')
				.setDescription('create a discord embed using JSON')
				.addStringOption((option) =>
					option
						.setName('json')
						.setDescription('the raw json or a sourcebin link to a json file')
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('the channel to send the embed to')
						.addChannelTypes(
							CT.GuildText,
							CT.GuildNews,
							CT.GuildNewsThread,
							CT.GuildPublicThread,
							CT.GuildPrivateThread,
						),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName('edit')
				.setDescription('edits an already sent embed by the bot using provided JSON')
				.addStringOption((option) =>
					option
						.setName('message')
						.setDescription('the message id of the message to edit')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('json')
						.setDescription('the raw json or a sourcebin link to a json file')
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('the channel where the message is situated in')
						.addChannelTypes(
							CT.GuildText,
							CT.GuildNews,
							CT.GuildNewsThread,
							CT.GuildPublicThread,
							CT.GuildPrivateThread,
						),
				),
		),
	async execute(interaction) {
		const subCommand = interaction.options.getSubcommand();
		if (subCommand === 'source') {
			await interaction.deferReply();
			const msgid = interaction.options.getString('message');
			const channel = interaction.options.getChannel('channel') || interaction.channel;
			let num = interaction.options.getInteger('number') || 1;

			const message = await (channel as GuildTextBasedChannel).messages
				.fetch(`${msgid}`)
				.then((res) => res)
				.catch(() => undefined);
			if (!message) {
				interaction.editReply(`Could not find any message with that id in <#${channel?.id}>`);
				return;
			}

			if (!message.embeds?.length) {
				interaction.editReply('The target message does not contain any embed');
				return;
			}

			if (num > message.embeds.length) {
				num = 1;
			}
			let source: Embed | string = message.embeds[num - 1];
			if (!source) {
				interaction.editReply('Did not find any embed in that message with that number');
				return;
			}
			// @ts-ignore
			// rome-ignore lint/performance/noDelete: <explanation>
			Object.keys(source).forEach((k) => source[k] == null && delete source[k]);

			source = JSON.stringify(source, null, 4);

			if (source.length <= 2000) {
				const embed = {
					title: `Embed Source for ${message.id}`,
					color: message.embeds[num - 1].color || Colors.Blue,
					description: `\`\`\`${source}\`\`\``,
				};
				await interaction.editReply({ embeds: [embed] });
				return;
			} else if (source.length > 2000) {
				const bin = await sourcebin.create({
					title: `Embed source for ${message.id}`,
					description: 'Raw JSON for a discord embed',
					files: [
						{
							content: source,
							language: 'JSON',
						},
					],
				});
				if (!bin) {
					interaction.editReply('Error while creating file on sourcebin');
					return;
				}
				interaction.editReply(`Source code over 2k characters. ${bin.url}`);
				return;
			}
		} else if (subCommand === 'create') {
			const description = interaction.options.getString('description');
			const title = interaction.options.getString('title') || null;
			const color = interaction.options.getString('color') || 'RANDOM';
			const channel = interaction.options.getChannel('channel') || interaction.channel;

			const embed = {
				title: title,
				color: color.toUpperCase() || Colors.Blue,
				description: description,
			} as APIEmbed;
			// @ts-ignore
			// rome-ignore lint/performance/noDelete: <explanation>
			Object.keys(embed).forEach((k) => embed[k] == null && delete embed[k]);

			await (channel as GuildTextBasedChannel).send({ embeds: [embed] });
			interaction.reply({ content: 'Embed sent successfully', ephemeral: true });
			return;
		} else if (subCommand === 'custom') {
			await interaction.deferReply({ ephemeral: true });
			const json = interaction.options.getString('json') as string;
			const channel = interaction.options.getChannel('channel') || interaction.channel;

			let embed;
			if (json.match(/https:\/\/sourceb\.in\/.*|https:\/\/srcb\.in\/.*/g)) {
				const result = await sourcebin
					.get(sourcebin.url(json))
					.then((res) => res.files[0].content)
					.catch(() => null);
				if (!result) {
					interaction.editReply(
						"Could not fetch the provided sourcebin URL. Please make sure it's a valid link and has some JSON content in it",
					);
					return;
				}
				try {
					embed = JSON.parse(JSON.stringify(result));
				} catch (error) {
					interaction.editReply(
						`Invalid JSON expression.\n \`\`\`${shorten(`${error}`, 1000)}\`\`\``,
					);
					return;
				}
			} else {
				try {
					embed = JSON.parse(json);
				} catch (error) {
					interaction.editReply('Invalid JSON expression.');
					return;
				}
			}

			try {
				await (channel as GuildTextBasedChannel).send({ embeds: [embed] });
				interaction.editReply('Embed sent Successfully');
				return;
			} catch (error) {
				interaction.editReply(
					"Could not send embed due to unexpected errors. Possible erros: Invalid JSON expression or breaking [discord embed limitations](https://discord.com/developers/docs/resources/channel#embed-limits 'Discord Embed Limits')",
				);
				return;
			}
		} else if (subCommand === 'edit') {
			await interaction.deferReply({ ephemeral: true });
			const json = interaction.options.getString('json') as string;
			const channel = interaction.options.getChannel('channel') || interaction.channel;
			const messageId = interaction.options.getString('message');
			const message = await (channel as GuildTextBasedChannel).messages
				.fetch(messageId as string)
				.then((res) => res)
				.catch(() => null);

			if (!message) {
				interaction.editReply('Could not find any message with that id in the channel');
				return;
			}
			if (!message.embeds.length) {
				interaction.editReply('The specified message does not have any embeds to edit');
				return;
			}

			if (!message.editable) {
				interaction.editReply('That message cannot be edited by the bot.');
				return;
			}

			let embed;
			if (json.match(/https:\/\/sourceb\.in\/.*|https:\/\/srcb\.in\/.*/g)) {
				const result = await sourcebin
					.get(sourcebin.url(json))
					.then((res) => res.files[0].content)
					.catch(() => null);
				if (!result) {
					interaction.editReply(
						"Could not fetch the provided sourcebin URL. Please make sure it's a valid link and has some JSON content in it",
					);
					return;
				}
				try {
					embed = JSON.parse(result);
				} catch (error) {
					interaction.editReply('Invalid JSON expression.');
					return;
				}
			} else {
				try {
					embed = JSON.parse(json);
				} catch (error) {
					interaction.editReply('Invalid JSON expression.');
					return;
				}
			}

			if (!embed) {
				interaction.editReply('Invalid JSON expression.');
				return;
			}

			try {
				await message.edit({ embeds: [embed] });
				interaction.editReply('Successfully edited embed');
				return;
			} catch (error) {
				log(error);
				interaction.editReply(
					'Unexpected error while editing message. Possible causes: Bot doesnt have permission to view channel, invalid JSON value, internal discord error',
				);
				return;
			}
		}
	},
};
