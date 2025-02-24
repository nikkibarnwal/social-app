import { NOT_FOUND_CODE, SUCCESS_CODE } from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import * as friendRepository from "./friendship.repository.js";

export const getFriendList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // const { userid } = req.user;
    const friends = await friendRepository.friendList(userId);
    res.status(SUCCESS_CODE).json({
      success: true,
      message: "Friend list fetched successfully",
      data: { friends },
    });
  } catch (error) {
    next(error);
  }
};

export const pendingFriendRequest = async (req, res, next) => {
  try {
    const { userid } = req.user;
    const friends = await friendRepository.pendingRequest(userid);
    res.status(SUCCESS_CODE).json({
      success: true,
      message: "Friend list fetched successfully",
      data: { friends },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFriendship = async (req, res, next) => {
  try {
    const { userid } = req.user;
    const { friendId } = req.params;
    if (userid == friendId) {
      throw new ApplicationError(
        "Recipient should not be logged in user",
        NOT_FOUND_CODE
      );
    }
    const friendshipStatus = await friendRepository.toggle(userid, friendId);
    res.status(SUCCESS_CODE).json({
      success: true,
      message: friendshipStatus.message,
    });
  } catch (error) {
    next(error);
  }
};

export const responseToRequest = async (req, res, next) => {
  try {
    const { userid } = req.user;
    const { friendId } = req.params;
    const { status } = req.body;
    if (status !== "accepted" && status !== "rejected") {
      throw new ApplicationError(
        "Enter valid status type should be one of:accepted, rejected",
        NOT_FOUND_CODE
      );
    }
    // Here logged in user react as recienpient, and friendId will be requester ID
    const friendshipStatus = await friendRepository.reactOnRequest(
      friendId,
      userid,
      status
    );
    if (!friendshipStatus) {
      throw new ApplicationError("Friend request not found", NOT_FOUND_CODE);
    }
    res.status(SUCCESS_CODE).json({
      success: true,
      message: `Friendship status successfully updated with ${status}`,
    });
  } catch (error) {
    next(error);
  }
};
