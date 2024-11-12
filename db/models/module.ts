import { model, Schema } from "mongoose";

const moduleSchemaPart = { type: Boolean, required: true, default: true };

export const moduleSchema = new Schema({
  _id: Number,
  Boost: moduleSchemaPart,
  Chapters: moduleSchemaPart,
  Logs: moduleSchemaPart,
  Mangadex: moduleSchemaPart,
  Memes: moduleSchemaPart,
  Radio: moduleSchemaPart,
  Facts: moduleSchemaPart,
  Reaction_Roles: moduleSchemaPart,
  Reddit: moduleSchemaPart,
  Rules: moduleSchemaPart,
  Starboard: moduleSchemaPart,
  Twitter: moduleSchemaPart,
  Welcome: moduleSchemaPart,
  Youtube: moduleSchemaPart,
}, {
  collection: "Modules",
});

/**
 * A data model for the modules in the bot. All defaults are true,
 * We only need one instance of this. So in prod, should only fetch
 * the entry with id 1
 */
export const Module = model("Modules", moduleSchema);
