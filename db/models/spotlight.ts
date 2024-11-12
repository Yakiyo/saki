import { model } from "mongoose";
import { Schema } from "mongoose";

export const spotlightSchema = new Schema({
  _id: String,
  source: { type: String, required: true },
  channel: { type: String, required: true },
}, {
  virtuals: {
    message: {
      get() {
        return this._id;
      },
      set(v) {
        return this._id = v;
      },
    },
  },
  collection: "Spotlights",
});

/**
 * A spotlight entry. The model id the message (the one sent in #spotlight channel).
 * Source is the id of the message that got starred and channel is where its from.
 */
export const Spotlight = model("Spotlights", spotlightSchema);
