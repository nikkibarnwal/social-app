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

const postRouter = express.Router();

postRouter.post(
  POSTS_BASE_URL,
  fileUpload.single("imageUrl"),
  postValidationMiddleware,
  postsContoller.createPost
);
postRouter.get(POSTS_ALL_URL, postsContoller.allPosts);
postRouter.get(POSTS_ID_URL, postsContoller.postById);
postRouter.get(POSTS_USER_URL, postsContoller.postByUserId);
postRouter.delete(POSTS_ID_URL, postsContoller.postsDeleteById);
postRouter.put(
  POSTS_ID_URL,
  fileUpload.single("imageUrl"),
  postsContoller.updatePosts
);

export default postRouter;
