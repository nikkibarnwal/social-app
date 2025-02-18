import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  NOT_FOUND_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import * as userRepository from "./user.repository.js";
import { InObjectId } from "../../utils/common.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, gender } = req.body;
    const newUser = {
      name,
      email,
      password,
      gender,
    };
    const createdUser = await userRepository.create(newUser);

    res.status(CREATED_CODE).json({
      success: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.getUser({ email }, true);
    console.log("raj---", password, user);
    // if user not found, return error response
    if (!user) {
      throw new ApplicationError("Wrong credentials", BAD_REQUEST_CODE);
    }

    // compare password with hashed password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new ApplicationError("Wrong credentials", BAD_REQUEST_CODE);
    } else {
      const token = jwt.sign(
        {
          userid: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const userObj = {
        userid: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      };
      res.status(SUCCESS_CODE).json({
        success: true,
        message: "login successfully",
        token,
        data: userObj,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    // Invalidate the token by setting it to an empty string or null
    res.status(SUCCESS_CODE).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const userDetail = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userRepository.getUser({
      _id: InObjectId(userId),
    });
    if (!user) {
      throw new ApplicationError("User not found", NOT_FOUND_CODE);
    } else {
      res.status(SUCCESS_CODE).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const allUserDetail = async (req, res, next) => {
  try {
    const users = await userRepository.getAllUser();
    res.status(SUCCESS_CODE).json({
      success: true,
      message: "Users fetched successfully",
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, gender } = req.body;
    const { userId } = req.params;
    const avtar = "";
    const newUser = {
      name,
      email,
      password,
      gender,
      avtar,
    };
    const updatedUser = await userRepository.updateUserById(userId, newUser);

    res.status(CREATED_CODE).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
