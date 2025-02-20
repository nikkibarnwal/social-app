import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import * as commentsRepository from "./comment.repository.js";

// Function to add a new comment
export const addComments = async (req, res, next) => {
  try {
    const { text } = req.body; // Extract text from request body
    const { postsId } = req.params; // Extract post ID from request parameters
    const { userid } = req.user; // Extract user ID from authenticated user
    if (!postsId) {
      // If post ID is not provided, throw an error
      throw new ApplicationError(
        "Posts id is required to add comments",
        BAD_REQUEST_CODE
      );
    }
    // Save the comment using the repository function
    const savedComment = await commentsRepository.add(postsId, userid, text);
    // Return a success response with the saved comment
    return res.status(CREATED_CODE).json({
      success: true,
      message: "Comments added successfully",
      data: savedComment,
    });
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

// Function to get comments for a specific post
export const getComments = async (req, res, next) => {
  try {
    const { postsId } = req.params; // Extract post ID from request parameters
    // Fetch comments using the repository function
    const comments = await commentsRepository.get(postsId);
    // Return a success response with the fetched comments
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

// Function to delete a specific comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params; // Extract comment ID from request parameters
    const { userid } = req.user; // Extract user ID from authenticated user
    // Remove the comment using the repository function
    await commentsRepository.remove(commentId, userid);
    // Return a success response indicating the comment was deleted
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Comments deleted successfully",
    });
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

// Function to update a specific comment
export const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body; // Extract text from request body
    const { commentId } = req.params; // Extract comment ID from request parameters
    const { userid } = req.user; // Extract user ID from authenticated user
    // Update the comment using the repository function
    const updatedComment = await commentsRepository.edit(
      commentId,
      userid,
      text
    );
    // Return a success response with the updated comment
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Comments updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};
