import {
	type GuildMember,
	type GuildTextBasedChannel,
	EmbedBuilder,
	AttachmentBuilder,
} from 'discord.js';
import Canvas from '@napi-rs/canvas';
import config from '../config';
import { log, rand } from '../util';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { request } from 'undici';

/**
 * Welcome message sending module
 */
export async function welcome(member: GuildMember) {
	const channel = (await client.channels.fetch(config.channels.welcome).catch((e) => {
		log(e);
		return null;
	})) as GuildTextBasedChannel | null;

	if (!channel) return; // dont go any further, some shit prolly happened

	const backgroundFile = await readFile(
		resolve(process.cwd(), `./assets/welcome-img/welcome${rand(1, 6)}.png`),
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
	ctx.fillStyle = '#ffffff';
	// keep reducing font size until it fits in 1050px
	let tw = ctx.measureText(name).width;
	while (tw > 1050) {
		font -= 5;
		ctx.font = `${font}px sans-serif`;
		tw = ctx.measureText(name).width;
	}
	ctx.fillText(name, center.x - tw / 2, center.y + radius + 100);

	// Final section, create embed, load attachment, send and stuff
	const count = await member.guild.members.fetch().then((stuff) => stuff.size);
	const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
		name: 'welcome-image.png',
	});
	const embed = new EmbedBuilder()
		.setImage(`attachment://${attachment.name}`)
		.setFooter({
			text: `Member Count: ${count}`,
		})
		.setThumbnail('https://i.imgur.com/5pavrlP.jpeg')
		.setTitle('Welcome to 『Gimai Seikatsu』 Discord Server!')
		.setDescription(
			'Also known as **"Days with my Step Sister"**, it\'s a story by **Mikawa Ghost** and illustrated by **Hiten**. If you can\'t see other channels, then accept server rules by reacting with :white_check_mark: in <#808067819118919750>. After this, visit <#804733433724272651> to know more about this series, or grab roles. **Have fun!**',
		)
		.setColor(16102651);

	channel.send({
		content: `Hey <@${member.id}>!`,
		embeds: [embed],
		files: [attachment],
	});
}
