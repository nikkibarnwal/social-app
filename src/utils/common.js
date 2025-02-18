import { validationResult } from "express-validator";
import { BAD_REQUEST_CODE } from "../config/statusCode.js";
import mongoose from "mongoose";
import ApplicationError from "../error-handler/applicationError.js";

const handleApiResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
  });
};
export default handleApiResponse;

export const handleValidationResponse = (req, res, next) => {
  const validationErrors = validationResult(req);
  // check if we don't have any errors then pass to the next
  if (validationErrors.isEmpty()) {
    return next();
  }
  const errMsg = [];
  validationErrors.errors.map((err) => errMsg.push({ [err.path]: err.msg }));
  return res
    .status(BAD_REQUEST_CODE)
    .json({ success: false, message: "Validation Failed", errors: errMsg });
};

export const InObjectId = (id) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    return ObjectId.createFromHexString(id);
  } catch (error) {
    throw new ApplicationError(
      "Enter valid id",
      BAD_REQUEST_CODE,
      error.message
    );
  }
};
