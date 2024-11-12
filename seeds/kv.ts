/**
 * A seed script for reading the config file and storing the values
 * in Deno's kv store (localStorage).
 */

import kv, { channels, roles } from "../util/kv.ts";

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
    reddit: string;
    twitter: string;
    youtube: string;
  };
  roles: {
    mod: string;
    member: string;
    bot: string;
    ln: string;
    manga: string;
  };
}

const file = Deno.env.get("PRODUCTION") ? "./config.json" : "./config.dev.json";

console.info("Seeding from file:", file);

const config: Config = JSON.parse(await Deno.readTextFile(file));

kv.guild.set(config.guildId);
kv.client.set(config.clientId);
kv.owners.set(config.owners);

for (const role of Object.keys(config.roles) as (keyof Config["roles"])[]) {
  kv.roles.set(role as typeof roles[number], config.roles[role] as string);
}

for (
  const channel of Object.keys(config.channels) as (keyof Config["channels"])[]
) {
  kv.channels.set(
    channel as typeof channels[number],
    config.channels[channel] as string,
  );
}

console.info("Seeding complete");

console.info(`Guild: ${kv.guild.get()}`);
console.info(`Client: ${kv.client.get()}`);
console.info(`Owners: ${kv.owners.get().join(", ")}`);
console.info("Roles:");
for (const role of roles) {
  console.info(`  ${role}: ${kv.roles.get(role)}`);
}
console.info("Channels:");
for (const channel of channels) {
  console.info(`  ${channel}: ${kv.channels.get(channel)}`);
}
