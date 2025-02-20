import Likes from "./like.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";
import Posts from "../posts/posts.schema.js";
import Comments from "../comment/comment.schema.js";
import {
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "../../config/statusCode.js";

// typeId may be posts id or comments id, based upon type we have sent
export const toggle = async (type, userid, typeId) => {
  try {
    let haveData;
    if (type === "posts") {
      haveData = await Posts.findById(typeId);
    } else {
      haveData = await Comments.findById(typeId);
    }
    if (!haveData) {
      return false;
    }
    const existingLike = await Likes.findOne({
      user: userid,
      posts: type === "posts" ? typeId : null,
      comment: type === "comments" ? typeId : null,
    });

    if (existingLike) {
      await Likes.findByIdAndDelete(existingLike._id);
      return true;
    } else {
      const newLike = new Likes({
        user: userid,
        posts: type === "posts" ? typeId : null,
        comment: type === "comments" ? typeId : null,
      });
      await newLike.save();
      return true;
    }
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
export const likesCount = async (type, typeId) => {
  try {
    let haveData;
    if (type === "posts") {
      haveData = await Posts.findById(typeId);
    } else {
      haveData = await Comments.findById(typeId);
    }
    if (!haveData) {
      return false;
    }

    const likeCount = await Likes.countDocuments({
      posts: type === "posts" ? typeId : null,
      comment: type === "comments" ? typeId : null,
    });

    const likes = await Likes.find({
      posts: type === "posts" ? typeId : null,
      comment: type === "comments" ? typeId : null,
    })
      .populate("user", "_id name email")
      .populate(
        type === "posts" ? "posts" : "comment",
        type === "posts" ? "_id caption imageUrl" : "_id text"
      );

    return { likeCount, likes };
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
