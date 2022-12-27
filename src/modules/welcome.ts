import { type GuildMember, type Client, type GuildTextBasedChannel, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import Canvas from "@napi-rs/canvas";
import config from "../config";
import { log, rand } from "../util";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { request } from "undici";

/**
 * Welcome message sending module
 */
export async function welcome(member: GuildMember, client: Client<true>) {
    const channel = await client.channels.fetch(config.channels.welcome)
        .catch((e) => {
            log(e); 
            return null;
        }) as GuildTextBasedChannel | null;

    if (!channel) return; // dont go any further, some shit prolly happened

    const backgroundFile = await readFile(resolve(process.cwd(), `./assets/welcome-img/welcome${rand(1, 6)}.png`));
    const bg = new Canvas.Image();
    bg.src = backgroundFile;
    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the bg first
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    const name = member.nickname ? member.nickname + '#' + member.user.discriminator : member.user.tag;

    // Fetch user avatar
    const { body } = await request(member.user.avatarURL({ extension: 'png', size: 1024 }) as string);
    const avatar = new Canvas.Image();
    avatar.src = Buffer.from(await body.arrayBuffer());

    // Write username
    let font = 80;
    ctx.font = `${font}px sans-serif`;
    ctx.fillStyle = "#ffffff";
    // keep reducing font size until it fits in 1050px
    let tw = ctx.measureText(name).width;
    while (tw > 1050) {
        font-= 5;
        ctx.font = `${font}px sans-serif`;
        tw = ctx.measureText(name).width;
    }
    // Position the mid of the text to a distance of (3/4th of width - 120px) of width
    // from the left side and (3/4th of height + 120px) from the top.
    const tx = canvas.width * (3 / 4) - 120;
    const ty = canvas.height * (3 / 4) + 180;

    ctx.fillText(name, tx - (tw / 2), ty, 1050);

    ctx.save();
    // Draw avatar. First draw an arc, clip it, paste body and stroke it.
    ctx.lineWidth = 20;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    const radius = 205;
    ctx.arc(tx, ty - 320, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, tx - radius, ty - 320 - radius);
    ctx.stroke();

    ctx.restore();

    // Final section, create embed, load attachment, send and stuff
    const count = await member.guild.members.fetch().then(stuff => stuff.size);
    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: "welcome-image.png"
    });
    const embed = new EmbedBuilder()
        .setImage(`attachment://${attachment.name}`)
        .setFooter({
            text: `Member Count: ${count}`,
        })
        .setThumbnail("https://i.imgur.com/5pavrlP.jpeg")
        .setTitle("Welcome to 『Gimai Seikatsu』 Discord Server!")
        .setDescription("Also known as **\"Days with my Step Sister\"**, it's a story by **Mikawa Ghost** and illustrated by **Hiten**. If you can't see other channels, then accept server rules by reacting with :white_check_mark: in <#808067819118919750>. After this, visit <#804733433724272651> to know more about this series, or grab roles. **Have fun!**")
        .setColor(16102651);

    channel.send({
        embeds: [embed],
        files: [attachment]
    })
}