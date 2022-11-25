interface Config {
    clientId: string,
    guildId: string,
    owners: string[],
    channels: {
        affiliate: string
    }
}

let config: any = {};

if (process.env.NODE_ENV === 'production') {
    config = require("../config.json");
} else {
    config = require("../config.dev.json");
}

export default { ...config} as Config;
