import Friendship from "./friendship.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { INTERNAL_SERVER_ERROR_CODE } from "../../config/statusCode.js";

export const friendList = async (userId) => {
  try {
    return await Friendship.find({
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" },
      ],
    }).populate("requester recipient", "_id name email gender");
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const pendingRequest = async (userId) => {
  try {
    return await Friendship.find({
      requester: userId,
      status: "pending",
    }).populate("recipient", "_id name email gender");
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const toggle = async (requesterId, recipientId) => {
  try {
    const friendship = await Friendship.findOne({
      requester: requesterId,
      recipient: recipientId,
    });

    if (friendship) {
      await Friendship.deleteOne({ _id: friendship._id });
      return { message: "Friendship removed" };
    } else {
      const newFriendship = new Friendship({
        requester: requesterId,
        recipient: recipientId,
        status: "pending",
      });
      await newFriendship.save();
      return { message: "Friendship request sent" };
    }
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const reactOnRequest = async (requesterId, recipientId, status) => {
  try {
    return await Friendship.findOneAndUpdate(
      {
        requester: requesterId,
        recipient: recipientId,
      },
      {
        $set: {
          status,
        },
      }
    );
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
