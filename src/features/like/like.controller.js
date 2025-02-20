import {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import * as likeRepository from "./like.repository.js";

export const toggleLikes = async (req, res, next) => {
  const { id, type } = req.params;
  const { userid } = req.user;

  try {
    if (type !== "posts" && type !== "comments") {
      return res.status(BAD_REQUEST_CODE).json({
        success: false,
        message: "Invalid type should be one of: posts, comments",
        validation: "failed",
      });
    }
    const result = await likeRepository.toggle(type, userid, id);
    if (!result) {
      throw new ApplicationError(`Unable to find ${type} data`, NOT_FOUND_CODE);
    }

    res.status(SUCCESS_CODE).json({
      success: true,
      message: "Likes toggled successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getLikes = async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const likeDetails = await likeRepository.likesCount(type, id);
    if (!likeDetails) {
      throw new ApplicationError(`Unable to find ${type} data`, NOT_FOUND_CODE);
    }
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Likes fetched successfully",
      data: likeDetails,
    });
  } catch (error) {
    next(error);
  }
};
