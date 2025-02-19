import express from "express";
import * as postsContoller from "./posts.controller.js";
import postValidationMiddleware from "./postsValidation.middleware.js";
import fileUpload from "../../middlewares/fileUpload.middleware.js";
import {
  POSTS_ALL_URL,
  POSTS_BASE_URL,
  POSTS_ID_URL,
  POSTS_USER_URL,
} from "../../utils/apiUrl.js";
import jwtAuthMiddleware from "../../middlewares/jwtAuth.middleware.js";

const postRouter = express.Router();

postRouter.post(
  POSTS_BASE_URL,
  jwtAuthMiddleware,
  fileUpload.single("imageUrl"),
  postValidationMiddleware,
  postsContoller.createPost
);
postRouter.get(POSTS_ALL_URL, postsContoller.allPosts);
postRouter.get(POSTS_ID_URL, postsContoller.postById);
postRouter.get(POSTS_USER_URL, jwtAuthMiddleware, postsContoller.postByUserId);
postRouter.delete(
  POSTS_ID_URL,
  jwtAuthMiddleware,
  postsContoller.postsDeleteById
);
postRouter.put(
  POSTS_ID_URL,
  jwtAuthMiddleware,
  fileUpload.single("imageUrl"),
  postsContoller.updatePosts
);

export default postRouter;
