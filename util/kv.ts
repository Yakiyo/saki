// KV storage for the bot's configuration using deno's localStorage.
//
// Using localStorage gives the benefit of being able to get and set the values in runtime
// and it is persisted across restarts. While reading from a json file was done in the past,
// changes in values were not persisted across restarts without being able to rewrite the
// config file.

/**
 * Channels stored in the kv
 */
export const channels = [
  "affiliate",
  "updates",
  "activity_log",
  "mod_log",
  "modmail",
  "welcome",
  "server_updates",
  "spotlight",
  // feeds related channels
  "reddit",
  "twitter",
  "youtube",
] as const;

/**
 * Roles stored in the kv
 */
export const roles = ["mod", "member", "bot", "ln", "manga"] as const;

const _get = (key: string) => localStorage.getItem(key);
const _set = (key: string, value: string) => localStorage.setItem(key, value);

/**
 * Key-Value store for the bot's configuration
 */
export const kv = {
  roles: {
    get: (key: typeof roles[number]) => _get(`roles.${key}`),
    set: (key: typeof roles[number], value: string) =>
      _set(`roles.${key}`, value),
  },

  guild: {
    get: () => _get("guild"),
    set: (value: string) => _set("guild", value),
  },

  client: {
    get: () => _get("client"),
    set: (value: string) => _set("client", value),
  },

  channels: {
    get: (key: typeof channels[number]) => _get(`channels.${key}`),
    set: (key: typeof channels[number], value: string) =>
      _set(`channels.${key}`, value),
  },

  owners: {
    get: () => localStorage.getItem("owners")?.split(",") ?? [],
    set: (ids: string[]) => localStorage.setItem("owners", ids.join(",")),
    // adds an individual id to the list of owners
    add: (id: string) => {
      const ids = localStorage.getItem("owners")?.split(",") ?? [];
      ids.push(id);
      localStorage.setItem("owners", ids.join(","));
    },
  },
};

export default kv;
