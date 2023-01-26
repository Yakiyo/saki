import {
	type GuildMember,
	type GuildTextBasedChannel,
	EmbedBuilder,
	AttachmentBuilder,
} from 'discord.js';
import config from '../config';
import { log, rand } from '../util';
import Canvas from '@napi-rs/canvas';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { request } from 'undici';

export async function boost(member: GuildMember) {
	const channel = (await client.channels.fetch(config.channels.server_updates).catch((e) => {
		log(e);
		return null;
	})) as GuildTextBasedChannel | null;
	if (!channel) return;
	const backgroundFile = await readFile(
		resolve(process.cwd(), `./assets/boost-img/boost${rand(1, 3)}.png`),
	);
	const bg = new Canvas.Image();
	bg.src = backgroundFile;
	const canvas = Canvas.createCanvas(bg.width, bg.height);
	const ctx = canvas.getContext('2d');

	// Draw the bg first
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
	const name = member.user.tag;

	// Fetch user avatar
	const { body } = await request(
		member.user.displayAvatarURL({ extension: 'png', size: 1024 }) as string,
	);
	const avatar = new Canvas.Image();
	avatar.src = Buffer.from(await body.arrayBuffer());

	// Draw avatar
	ctx.save();
	ctx.lineWidth = 20;
	ctx.fillStyle = '#000000';
	ctx.beginPath();
	const radius = 205;
	const center = { x: 1380, y: 704 };
	ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(avatar, center.x - radius, center.y - radius, radius * 2, radius * 2);
	ctx.stroke();
	ctx.restore();

	// Write username
	let font = 80;
	ctx.font = `${font}px sans-serif`;
	ctx.fillStyle = '#000000';
	// keep reducing font size until it fits in 1050px
	let tw = ctx.measureText(name).width;
	while (tw > 1050) {
		font -= 5;
		ctx.font = `${font}px sans-serif`;
		tw = ctx.measureText(name).width;
	}
	ctx.fillText(name, center.x - tw / 2, center.y + radius + 100);

	const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
		name: 'boost-image.png',
	});
	const embed = new EmbedBuilder()
		.setImage(`attachment://${attachment.name}`)
		.setThumbnail('https://i.imgur.com/5pavrlP.jpeg')
		.setTitle('Thank you for boosting the 『Gimai Seikatsu』 Discord Server!')
		.setDescription(
			"Boosting the server gets us a bunch of cool stuff, so we'd like to thank and reward you with a custom role for it." +
				`\nFeel free to message any <@&921695160407052320> or modmail our bot <@${config.clientId}> with a name and color for your custom role.`,
		)
		.setColor(16102651);

	channel.send({
		content: `Thank you <@${member.id}>!`,
		embeds: [embed],
		files: [attachment],
	});
}
