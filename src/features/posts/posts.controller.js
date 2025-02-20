import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  NOT_FOUND_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import * as postsRepository from "./posts.repository.js";

export const createPost = async (req, res, next) => {
  try {
    const { caption } = req.body;
    const { userid } = req.user;
    if (!req?.file?.filename) {
      return res.status(BAD_REQUEST_CODE).json({
        success: false,
        message: "Validation Failed",
        errors: "Posts image is required",
      });
    }
    const newPosts = {
      caption,
      imageUrl: req?.file?.filename,
      user: userid,
    };
    const savedPosts = await postsRepository.create(newPosts);
    return res.status(CREATED_CODE).json({
      success: true,
      message: "Posts created successfully",
      data: savedPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const allPosts = async (req, res, next) => {
  try {
    const posts = await postsRepository.getAll();
    if (!posts) {
      throw new ApplicationError("Posts not found", NOT_FOUND_CODE);
    }
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Posts fetched successfully",
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

export const postById = async (req, res, next) => {
  try {
    const { postsId } = req.params;
    const posts = await postsRepository.getById(postsId);
    if (!posts) {
      throw new ApplicationError("Posts not found", NOT_FOUND_CODE);
    }
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const postByUserId = async (req, res, next) => {
  try {
    const { userid } = req.user;
    const posts = await postsRepository.getByUserId(userid);
    if (!posts) {
      throw new ApplicationError("Posts not found", NOT_FOUND_CODE);
    }
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const postsDeleteById = async (req, res, next) => {
  try {
    const { postsId } = req.params;
    const { userid } = req.user;
    const deletedPosts = await postsRepository.deletePosts(postsId, userid);
    if (!deletedPosts) {
      throw new ApplicationError("Posts not found", NOT_FOUND_CODE);
    }
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Posts deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePosts = async (req, res, next) => {
  try {
    const { postsId } = req.params;
    const { caption } = req.body;
    const { userid } = req.user;
    const posts = await postsRepository.updatePosts(
      postsId,
      userid,
      caption,
      req?.file?.filename
    );
    return res.status(SUCCESS_CODE).json({
      success: true,
      message: "Posts updated successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};
