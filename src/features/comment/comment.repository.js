import {
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  UNAUTHORIZED_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { InObjectId } from "../../utils/common.js";
import Posts from "../posts/posts.schema.js";
import Comments from "./comment.schema.js";

export const add = async (postsId, userId, text) => {
  try {
    // check if posts exists
    const posts = await Posts.findById(postsId);
    if (!posts) {
      throw new ApplicationError("Posts not found", NOT_FOUND_CODE);
    }

    const newComments = new Comments({
      text,
      posts: InObjectId(postsId),
      user: InObjectId(userId),
    });
    await newComments.save();
    return newComments;
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const get = async (postsId) => {
  try {
    const comments = await Comments.find({ posts: InObjectId(postsId) })
      .populate("user", "_id name email gender avtar")
      .populate("posts");
    if (!comments) {
      throw new ApplicationError("Comments not found", NOT_FOUND_CODE);
    }
    return comments;
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const remove = async (commentId, userId) => {
  try {
    const comment = await Comments.findById(commentId).populate("posts");
    if (!comment) {
      throw new ApplicationError("Comment not found", NOT_FOUND_CODE);
    }

    // comments can only be deleted by who commented  or created the posts
    if (
      comment.user.toString() !== userId &&
      comment.posts.user.toString() !== userId
    ) {
      throw new ApplicationError(
        "Unauthorized to delete this comment",
        UNAUTHORIZED_CODE
      );
    }

    return await Comments.findByIdAndDelete(commentId);
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const edit = async (commentId, userId, text) => {
  try {
    const comment = await Comments.findById(commentId).populate("posts");
    if (!comment) {
      throw new ApplicationError("Comment not found", NOT_FOUND_CODE);
    }

    // comments can only be updated by who commented  or created the posts
    if (
      comment.user.toString() !== userId &&
      comment.posts.user.toString() !== userId
    ) {
      throw new ApplicationError(
        "Unauthorized to update this comment",
        UNAUTHORIZED_CODE
      );
    }
    return await Comments.findByIdAndUpdate(commentId, { text });
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
