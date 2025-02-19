import {
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { InObjectId } from "../../utils/common.js";
import Posts from "./posts.schema.js";

export const create = async (postsData) => {
  try {
    const newPosts = new Posts(postsData);
    await newPosts.save();
    return newPosts;
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation error
      throw error;
    }
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
export const getAll = async () => {
  try {
    return await Posts.find()
      .populate("user", "name email _id gender avtar")
      .sort({ updatedAt: -1 });
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const getById = async (postsId) => {
  try {
    return await Posts.findById(postsId).populate(
      "user",
      "name email _id gender avtar"
    );
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const getByUserId = async (user) => {
  try {
    return await Posts.find({ user })
      .populate("user", "name email _id gender avtar")
      .sort({ updatedAt: -1 });
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const deletePosts = async (postsId, userId) => {
  try {
    return await Posts.findOneAndDelete({
      _id: InObjectId(postsId),
      user: InObjectId(userId),
    });
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const updatePosts = async (postsId, userId, caption, imageUrl) => {
  try {
    const postsData = await Posts.findOne({
      _id: InObjectId(postsId),
      user: InObjectId(userId),
    });
    if (!postsData) {
      throw new ApplicationError("Posts not found", NOT_FOUND_CODE);
    }
    postsData.caption = caption || postsData.caption;
    postsData.imageUrl = imageUrl || postsData.imageUrl;

    await postsData.save();
    return postsData;
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation error
      throw error;
    }
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
