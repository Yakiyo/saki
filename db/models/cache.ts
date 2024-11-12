import { model, Schema } from "mongoose";

const linkType = {
  link: {
    type: String,
    required: true,
  },
};

export const cacheSchema = new Schema({
  _id: Number,
  chapter: [linkType],
  youtube: [linkType],
  twitter: [linkType],
  reddit: [linkType],
  mangadex: [linkType],
});

/**
 * A cache to store misc contents like the last chapter url, youtube url, twitter post
 * or reddit post that was sent from the feeds.
 * We only need one instance of this. So in prod, should only fetch
 * the entry with id 1
 */
export const Cache = model("Cache", cacheSchema);
