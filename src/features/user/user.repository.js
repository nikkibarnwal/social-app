import {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import User from "./user.schema.js";

export const create = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.validate(); // 🔍 Ensure validation runs before saving
    await newUser.save();
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  } catch (error) {
    if (
      // Handle unique constraint error
      (error.code === 11000 && error.keyPattern.email) ||
      error.name === "ValidationError" // Handle validation error
    ) {
      throw error;
    }
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const getUser = async (data, passwordRequired = false) => {
  try {
    //e.g. { email:email }
    const foundUser = await User.findOne(data);
    if (!passwordRequired) {
      const { password, ...userWithoutPassword } = foundUser.toObject();
      return userWithoutPassword;
    }
    return foundUser;
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
export const getAllUser = async () => {
  try {
    return await User.find({}, { password: 0, loginToken: 0 });
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const updateUserById = async (userId, updateData) => {
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new ApplicationError("User not found", NOT_FOUND_CODE);
    } else if (existingUser.email !== updateData.email) {
      //  Ensure the new email is unique (Check if it's already taken)
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new ApplicationError("Email is already in use", BAD_REQUEST_CODE);
      }
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        {
          new: true,
          runValidators: true, // ✅ Ensures validation on update and excludes password
          context: "query",
          select: "-password",
        }
      );
      return updatedUser;
    }
  } catch (error) {
    if (
      // Handle unique constraint error
      (error.code === 11000 && error.keyPattern.email) ||
      error.name === "ValidationError" // Handle validation error
    ) {
      throw error;
    }
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
export const addJwtToken = async (id, token) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      $push: {
        loginToken: token,
      },
    });
    if (!updatedUser) {
      throw new ApplicationError("User not found", NOT_FOUND_CODE);
    }
    return updatedUser;
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};

export const removeJwtToken = async (userId, token = null) => {
  try {
    const updateQuery = token
      ? { $pull: { loginToken: token } }
      : { $set: { loginToken: [] } };

    const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    if (!updatedUser) {
      throw new ApplicationError("User not found", NOT_FOUND_CODE);
    }
    return updatedUser;
  } catch (error) {
    throw new ApplicationError(
      "Something went wrong",
      INTERNAL_SERVER_ERROR_CODE,
      error.message
    );
  }
};
