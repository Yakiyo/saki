interface Config {
    clientId: string,
    guildId: string,
    owners: string[],
    channels: {
        affiliate: string,
        updates: string,
        activity_log: string,
        mod_log: string,
        modmail: string,
    },
    roles: {
        mod: string
    }
}

let config = require("../config.json");

if (process.env.NODE_ENV !== 'production') {
    try {
        let dev = require("../config.dev.json");
        config = {
            ...config,
            ...dev
        };
    } catch (_) {}
}

export default config as Config;
