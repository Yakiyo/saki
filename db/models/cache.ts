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

export const Cache = model("Cache", cacheSchema);
