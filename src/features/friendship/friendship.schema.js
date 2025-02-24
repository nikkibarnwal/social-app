import mongoose from "mongoose";
import {
  FRIENDSHIP_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

const Schema = mongoose.Schema;

const FriendshipSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION,
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamp: true }
);

const Friendship = mongoose.model(FRIENDSHIP_COLLECTION, FriendshipSchema);

export default Friendship;
