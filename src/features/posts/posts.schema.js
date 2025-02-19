import mongoose from "mongoose";
import { POST_COLLECTION, USER_COLLECTION } from "../../config/collection.js";

const postSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9!'@. ]+$/,
        "Caption must contain only letters, numbers, and spaces !'@.",
      ], // ✅ Allow only alphanumeric + spaces !'
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION,
      required: true,
    },
  },
  { timestamps: true }
);

const Posts = mongoose.model(POST_COLLECTION, postSchema);

export default Posts;

const samplePosts = [
  {
    caption: "Enjoying the sunny weather!",
    imageUrl: "http://example.com/image1.jpg",
    user: "60d0fe4f5311236168a109ca",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    caption: "Had a great time at the beach.",
    imageUrl: "http://example.com/image2.jpg",
    user: "60d0fe4f5311236168a109cb",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    caption: "Loving this new book I'm reading.",
    imageUrl: "http://example.com/image3.jpg",
    user: "60d0fe4f5311236168a109cc",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export { samplePosts };
