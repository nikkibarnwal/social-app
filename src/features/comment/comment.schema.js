import mongoose from "mongoose";
import {
  COMMENTS_COLLECTION,
  POST_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9!'@. ]+$/,
        "Caption must contain only letters, numbers, and spaces !'@.",
      ], // ✅ Allow only alphanumeric + spaces !'
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: POST_COLLECTION,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION,
    },
  },
  {
    timestamps: true,
  }
);

const Comments = mongoose.model(COMMENTS_COLLECTION, commentSchema);

export default Comments;
