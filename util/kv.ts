export const channels = [
  "affiliate",
  "updates",
  "activity_log",
  "mod_log",
  "modmail",
  "welcome",
  "server_updates",
  "spotlight",
] as const;
export const feeds = ["reddit", "twitter", "youtube"] as const;
export const roles = ["mod", "member", "bot", "ln", "manga"] as const;

const _get = (key: string) => localStorage.getItem(key);
const _set = (key: string, value: string) => localStorage.setItem(key, value);

export const kv = {
  roles: {
    get: (key: typeof roles[number]) => localStorage.getItem(`roles.${key}`),
    set: (key: typeof channels[number], value: string) =>
      localStorage.setItem(`roles.${key}`, value),
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

  guild: {
    get: () => _get("guild"),
    set: (value: string) => _set("guild", value),
  },

  client: {
    get: () => _get("client"),
    set: (value: string) => _set("client", value),
  },
};

export default kv;
