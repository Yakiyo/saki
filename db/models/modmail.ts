import { model, Schema } from "mongoose";

export const modmailSchema = new Schema({
  _id: String,
  isOpen: { type: Boolean, required: true, default: true },
  userId: { type: String, required: true },
  createdById: { type: String, required: true },
  closedById: { type: String },
  closedAt: { type: Date },
}, {
  virtuals: {
    threadId: {
      get() {
        return this._id;
      },
      set(v) {
        return this._id = v;
      },
    },
  },
  collection: "Modmail",
});

/**
 * A model for modmail entries
 */
export const Modmail = model("Modmail", modmailSchema);
