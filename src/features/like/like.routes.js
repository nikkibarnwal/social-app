import express from "express";
import { GET_LIKES_URL, LIKES_TOGGLE_URL } from "../../utils/apiUrl.js";
import * as likesController from "./like.controller.js";
import jwtAuthMiddleware from "../../middlewares/jwtAuth.middleware.js";

const likesRouter = express.Router();

likesRouter.get(GET_LIKES_URL, likesController.getLikes);
likesRouter.post(
  LIKES_TOGGLE_URL,
  jwtAuthMiddleware,
  likesController.toggleLikes
);

export default likesRouter;
