import express from "express";
import { COMMENTS_ID_URL, POSTS_ID_URL } from "../../utils/apiUrl.js";
import * as commentController from "./comment.controller.js";
import jwtAuthMiddleware from "../../middlewares/jwtAuth.middleware.js";
import commentValidation from "./commentValidation.middleware.js";

const commentsRouter = express.Router();

// get comments by postsId
commentsRouter.get(POSTS_ID_URL, commentController.getComments);
// Add comments
commentsRouter.post(
  POSTS_ID_URL,
  jwtAuthMiddleware,
  commentValidation,
  commentController.addComments
);
// Delete Comments
commentsRouter.delete(
  COMMENTS_ID_URL,
  jwtAuthMiddleware,
  commentController.deleteComment
);
// Update Comment
commentsRouter.put(
  COMMENTS_ID_URL,
  commentValidation,
  jwtAuthMiddleware,
  commentController.updateComment
);

export default commentsRouter;
