import { BaseGuildVoiceChannel } from 'discord.js';
import config, { type Config } from '../config';
import { log } from './logger';

type statsChannel = keyof Config['channels']['stats'];

export async function statsUpdate(type: statsChannel) {
	let name: string;
	let channelId: string;
	const guild = await client.guilds.fetch(config.guildId).catch(log);
	if (!guild) return;
	const members = await guild.members.fetch();
	switch (type) {
		case 'member': {
			channelId = config.channels.stats.member;
			const count = members.filter((m) => !m.user.bot).size;
			name = `👥 Member Count: ${count}`;
			break;
		}
		case 'bot': {
			channelId = config.channels.stats.bot;
			const count = members.filter((m) => m.user.bot).size;
			name = `🤖 Bots: ${count}`;
			break;
		}
		default:
			return;
	}
	const channel = (await client.channels
		.fetch(channelId)
		.catch(log)) as BaseGuildVoiceChannel | null;

	if (!channel) return;
	channel
		.edit({
			name,
		})
		.catch(log);
}
