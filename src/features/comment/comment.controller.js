import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import * as commentsRepository from "./comment.repository.js";

export const addComments = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { postsId } = req.params;
    const { userid } = req.user;
    if (!postsId) {
      throw new ApplicationError(
        "Posts id is required to add comments",
        BAD_REQUEST_CODE
      );
    }
    const savedComment = await commentsRepository.add(postsId, userid, text);
    return res.status(CREATED_CODE).json({
      success: true,
      message: "Comments added successfully",
      data: savedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { postsId } = req.params;
    const comments = await commentsRepository.get(postsId);
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userid } = req.user;
    await commentsRepository.remove(commentId, userid);
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Comments deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { commentId } = req.params;
    const { userid } = req.user;
    const updatedComment = await commentsRepository.edit(
      commentId,
      userid,
      text
    );
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Comments updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};
