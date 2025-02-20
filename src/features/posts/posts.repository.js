import {
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { InObjectId } from "../../utils/common.js";
import Comments from "../comment/comment.schema.js";
import Likes from "../like/like.schema.js";
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
    const posts = await Posts.find()
      .populate("user", "name email _id gender avtar")
      .sort({ updatedAt: -1 });
    if (posts.length <= 0) {
      return false;
    }
    const postsWithCounts = await Promise.all(
      posts?.map(async (post) => {
        const { likeCounts, commentsCounts } = await reactedCounts(post._id);
        return {
          ...post.toObject(),
          likeCounts,
          commentsCounts,
        };
      })
    );

    return postsWithCounts;
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
    const post = await Posts.findById(postsId).populate(
      "user",
      "name email _id gender avtar"
    );
    if (!post) {
      return false;
    }
    const { likeCounts, commentsCounts } = await reactedCounts(postsId);

    return {
      ...post.toObject(),
      likeCounts,
      commentsCounts,
    };
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
    const posts = await Posts.find({ user })
      .populate("user", "name email _id gender avtar")
      .sort({ updatedAt: -1 });
    if (posts.length <= 0) {
      return false;
    }
    const postsWithCounts = await Promise.all(
      posts?.map(async (post) => {
        const { likeCounts, commentsCounts } = await reactedCounts(post._id);
        return {
          ...post.toObject(),
          likeCounts,
          commentsCounts,
        };
      })
    );
    return postsWithCounts;
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

export const reactedCounts = async (posts) => {
  try {
    const likeCounts = await Likes.countDocuments({ posts });
    const commentsCounts = await Comments.countDocuments({ posts });
    return {
      likeCounts,
      commentsCounts,
    };
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
