import {
	Events,
	ChannelType as CT,
	type Message,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	type BaseGuildTextChannel,
} from 'discord.js';
import type { Event } from '../struct/types';
import config from '../config';
import { dateTimestamp, log } from '../util';

export const event: Event = {
	name: Events.MessageCreate,
	once: false,
	async handle(message: Message) {
		if (message.author.bot) return;
		switch (message.channel.type) {
			case CT.DM: {
				if (message.content.startsWith(';')) return;
				const channel = (await client.channels
					.fetch(config.channels.modmail)
					.catch(log)) as BaseGuildTextChannel | null;
				if (!channel) {
					message.channel.send(
						'Unexpected internal error when fetching modmail channel. Please report this to dev or try later.',
					);
					return;
				}
				let mail = await prisma.modmail.findFirst({
					where: {
						isOpen: true,
						userId: message.author.id,
					},
				});

				if (!mail) {
					const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setLabel('YES')
							.setStyle(ButtonStyle.Primary)
							.setCustomId('mail_yes')
							.setEmoji('✅'),
						new ButtonBuilder()
							.setLabel('NO')
							.setStyle(ButtonStyle.Danger)
							.setCustomId('mail_no')
							.setEmoji('❌'),
					);
					const response = await message.channel.send({
						embeds: [
							{
								title: 'Confirmation',
								color: 16105148,
								description: 'Do you want to open a modmail with the Gimai Staff Team?',
								footer: {
									text: 'Tip: Messages in dms starting with ; are ignored.',
								},
							},
						],
						components: [row],
					});

					const i = await response
						.awaitMessageComponent({
							componentType: ComponentType.Button,
							time: 10 * 1000, // 10 seconds
							filter: (b) => {
								b.deferUpdate();
								return b.user.id === message.author.id;
							},
						})
						.catch(() => null);

					if (!i || i.customId === 'mail_no') {
						response.edit({
							embeds: [
								{
									title: 'Process Cancelled',
									color: 16105148,
								},
							],
							components: [],
						});
						return;
					}
					response.edit({
						embeds: [
							{
								color: 16105148,
								title: 'Initiating modmail....',
							},
						],
						components: [],
					});
					const userMails = await prisma.modmail.findMany({
						where: {
							userId: message.author.id,
						},
					});

					const startMessage = await channel.send({
						embeds: [
							{
								title: 'New Modmail',
								color: 16105148,
								description: `${message.author.tag} <@${message.author.id}>`,
								fields: [
									{
										name: 'Created',
										value: dateTimestamp(message.author.createdAt),
										inline: true,
									},
									{
										name: 'ID',
										value: message.author.id,
										inline: true,
									},
								],
							},
						],
					});
					const thread = await channel.threads
						.create({
							name: `${message.author.tag} - ${userMails.length + 1}`,
							reason: `Modmail by ${message.author.tag}`,
							startMessage,
						})
						.catch(log);

					if (!thread) {
						response.edit('Unexpected error while creating modmail thread. Please report to dev');
						return;
					}
					mail = await prisma.modmail
						.create({
							data: {
								threadId: thread.id,
								createdById: message.author.id,
								userId: message.author.id,
							},
						})
						.catch(log);
					if (!mail) {
						message.edit('Unexpected error while creating modmail entry. Please report to dev');
						return;
					}
					response.edit({
						embeds: [
							{
								description: 'Successfully created modmail!',
								color: 16105148,
							},
						],
					});
				}
				const thread = channel.threads.cache.find((x) => x.id === mail?.threadId);
				if (!thread) {
					message.edit('Unexpected error while finding modmail. Please report to dev');
					return;
				}
				await thread
					.send({
						embeds: [
							{
								color: 5793266,
								description: message.content,
								author: {
									name: message.author.tag,
									icon_url: message.author.displayAvatarURL(),
								},
								footer: {
									text: 'Created on',
								},
								timestamp: new Date().toISOString(),
							},
						],
					})
					.then(() => message.react('✅'))
					.catch((e) => {
						log(e);
						message.react('❌');
					});

				return;
			}

			case CT.PrivateThread:
			case CT.PublicThread: {
				if (message.channel.parentId !== config.channels.modmail) return;
				if (message.content.startsWith(';')) return;
				const mail = await prisma.modmail.findUnique({
					where: {
						threadId: message.channelId,
					},
				});
				if (!mail?.isOpen) return;
				const member = await message.guild?.members.fetch(mail.userId).catch(log);
				if (!member) {
					message.channel.send(
						'Could not find member in server. Member probably left. Please close this modmail',
					);
					return;
				}
				await member.user
					.send({
						embeds: [
							{
								color: 5763719,
								author: {
									name: message.author.tag,
									icon_url: message.author.displayAvatarURL(),
								},
								description: message.content,
							},
						],
					})
					.catch((e) => {
						if (e.code === 50007) {
							message.channel.send(
								'Unable the send modmail reply. The user has their dms disabled for this server. Please tell them to enable it first!',
							);
							return;
						}
						message.channel.send('Unexpected error while sending message. Please check logs');
						return log(e);
					});

				return;
			}

			default:
				return;
		}
	},
};
