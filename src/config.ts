interface Config {
	clientId: string;
	guildId: string;
	owners: string[];
	channels: {
		affiliate: string;
		updates: string;
		activity_log: string;
		mod_log: string;
		modmail: string;
		welcome: string;
		server_updates: string;
		spotlight: string;
		feeds: {
			reddit: string;
			twitter: string;
			youtube: string;
		};
		stats: {
			member: string;
			bot: string;
			channel: string;
			role: string;
		};
	};
	roles: {
		mod: string;
		member: string;
		bot: string;
		ln: string;
		manga: string;
	};
}

let config = require('../config.json');

if (process.env.NODE_ENV !== 'production') {
	try {
		let dev = require('../config.dev.json');
		config = {
			...config,
			...dev,
		};
	} catch (_) {}
}

export default config as Config;
