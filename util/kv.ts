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

export default {
  roles: {
    get: (key: typeof roles[number]) => localStorage.getItem(`roles.${key}`),
    set: (key: typeof channels[number], value: string) =>
      localStorage.setItem(`roles.${key}`, value),
  },

  owners: {
    get: () => localStorage.getItem("owners")?.split(","),
    set: (ids: string[]) => localStorage.setItem("owners", ids.join(",")),
    // adds an individual id to the list of owners
    add: (id: string) => {
      let ids = localStorage.getItem("owners")?.split(",");
      if (!ids) ids = [];
      ids.push(id);
      localStorage.setItem("owners", ids.join(","));
    },
  },

  guild: {
    get: () => localStorage.getItem("guild"),
    set: (id: string) => localStorage.setItem("guild", id),
  },
};
