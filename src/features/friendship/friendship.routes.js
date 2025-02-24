import express from "express";
import {
  GET_FRIENDS_URL,
  PENDING_REQUEST_URL,
  RESPONSE_TO_REQUEST_URL,
  TOGGLE_FRIENDSHIP_URL,
} from "../../utils/apiUrl.js";
import * as friendsController from "./friendship.controller.js";

const friendshipRouter = express.Router();

friendshipRouter.get(GET_FRIENDS_URL, friendsController.getFriendList);
friendshipRouter.get(
  PENDING_REQUEST_URL,
  friendsController.pendingFriendRequest
);
friendshipRouter.post(
  TOGGLE_FRIENDSHIP_URL,
  friendsController.toggleFriendship
);
friendshipRouter.post(
  RESPONSE_TO_REQUEST_URL,
  friendsController.responseToRequest
);

export default friendshipRouter;
