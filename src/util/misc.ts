import { inspect } from 'util';

/**
 * Shorten a string upto num length
 */
export function shorten(str: string, num = 1000): string | undefined {
	if (typeof str !== 'string') return undefined;
	if (str.length > num) {
		return `${str.substring(0, num + 1)}...`;
	} else {
		return str;
	}
}

/**
 * Clean a provided string-ish object of any sort of secrets
 * of the bot.
 */
export async function clean(text: any) {
	if (text && text.constructor.name === 'Promise') {
		text = await text;
	}

	if (typeof text !== 'string') {
		text = inspect(text, { depth: 1 });
	}

	text = text
		.replace(/`/g, '`' + String.fromCharCode(8203))
		.replace(/@/g, '@' + String.fromCharCode(8203));

	const envs = ['DISCORD_TOKEN', 'DATABASE_URL', 'YOUTUBE_API_KEY', 'TWITTER_BEARER_TOKEN'];
	for (const env of envs) {
		const tokenRegex = new RegExp(process.env[env] as string, 'g');
		text = text.replace(tokenRegex, `[${env}]`);
	}
	return shorten(text, 1800);
}

/**
 * Generate a random number between max and min (both inclusive)
 */
export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
