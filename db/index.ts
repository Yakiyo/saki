import { connect as conn, disconnect as disconn, pluralize } from "mongoose";

// disable mongoose's custom pluralization thingy, my model names are wanky
pluralize((str) => str);

/**
 * Connect to the database
 */
export async function connect() {
  const uri = Deno.env.get("DATABASE_URL") ?? "";
  if (!uri.length) throw new Error("No database URI provided");

  await conn(uri);
}

/**
 * Disconnect from the database
 */
export async function disconnect() {
  await disconn();
}

export * from "./models/cache.ts";
export * from "./models/modmail.ts";
export * from "./models/module.ts";
export * from "./models/spotlight.ts";
