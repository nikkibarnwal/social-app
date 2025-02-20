import mongoose from "mongoose";
import {
  COMMENTS_COLLECTION,
  LIKES_COLLECTION,
  POST_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION,
      required: true,
    },
    posts: {
      type: Schema.Types.ObjectId,
      ref: POST_COLLECTION,
      required: false,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: COMMENTS_COLLECTION,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Likes = mongoose.model(LIKES_COLLECTION, likeSchema);

export default Likes;
