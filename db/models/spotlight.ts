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
});

export const Spotlight = model("Spotlights", spotlightSchema);
