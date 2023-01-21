import type { Message, BaseGuildTextChannel, APIEmbed } from 'discord.js';
import config from '../config';
import { dateTimestamp } from './discord';
import { log } from './logger';

/**
 * Utility function to create a new modmail
 */
export async function createMail(message: Message) {
	const channel = (await client.channels
		.fetch(config.channels.modmail)
		.catch(log)) as BaseGuildTextChannel | null;

	if (!channel) {
		throw 'Unexpected internal error when fetching modmail channel. Please report this to dev or try later.';
	}
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
		throw 'Unexpected error while creating modmail thread. Please report to dev';
	}
	const mail = await prisma.modmail
		.create({
			data: {
				threadId: thread.id,
				createdById: message.author.id,
				userId: message.author.id,
			},
		})
		.catch(log);

	if (!mail) {
		throw 'Unexpected error while creating modmail entry. Please report to dev';
	}
	return mail;
}

/**
 * Utility function to close modmails
 */
export async function closeMail(threadId: string) {
	const mail = await prisma.modmail.findUnique({
		where: {
			threadId,
		},
	});
	if (!mail) throw 'No modmail with that id exists';
	if (!mail.isOpen) throw 'Modmail is already closed';
	const channel = (await client.channels.fetch(
		config.channels.modmail,
	)) as BaseGuildTextChannel | null;
	if (!channel) throw 'Missing modmail channel. Was the channel deleted?';

	const embed: APIEmbed = {
		title: 'Closing Thread',
		color: 16105148,
		description:
			'Thank you for reaching out to the moderator team. Feel free to open another modmail if you need in the future.\nHappy to help!',
	};
	const thread = channel.threads.cache.find((x) => x.id === mail.threadId);
	if (thread && !thread.archived) {
		thread.send({
			embeds: [
				{
					...embed,
					description:
						'Closed modmail. Use the `/modmail open` command to start a new modmail again.',
				},
			],
		});
		thread.setArchived(true).catch(log);
	}
	const user = await client.users.fetch(mail.createdById).catch(log);
	user
		?.send({
			embeds: [embed],
		})
		.catch(log);

	await prisma.modmail
		.delete({
			where: {
				threadId: mail.threadId,
			},
		})
		.catch(log);
	return;
}
