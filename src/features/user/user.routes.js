import express from "express";
import * as userController from "./user.controller.js";
import {
  ALL_USER_DETAIL_URL,
  LOGOUT_ALL_DEVICES_URL,
  LOGOUT_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
  UPDATE_USER_DETAIL_URL,
  USER_DETAIL_URL,
} from "../../utils/apiUrl.js";
import validateUser from "./userValidation.middleware.js";
import jwtAuthMiddleware from "../../middlewares/jwtAuth.middleware.js";

const userRouter = express.Router();

// localhost:3000/api/users/signup
userRouter.post(SIGN_UP_URL, validateUser, userController.register);
userRouter.post(SIGN_IN_URL, validateUser, userController.login);
userRouter.post(LOGOUT_URL, jwtAuthMiddleware, userController.logout);
userRouter.post(
  LOGOUT_ALL_DEVICES_URL,
  jwtAuthMiddleware,
  userController.logoutAllDevices
);
userRouter.get(USER_DETAIL_URL, jwtAuthMiddleware, userController.userDetail);
userRouter.get(
  ALL_USER_DETAIL_URL,
  jwtAuthMiddleware,
  userController.allUserDetail
);
userRouter.put(
  UPDATE_USER_DETAIL_URL,
  jwtAuthMiddleware,
  userController.updateUser
);

export default userRouter;
