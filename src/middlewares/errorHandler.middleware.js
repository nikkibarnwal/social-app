import {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "../config/statusCode.js";
import { logger } from "./logger.middleware.js";

import ApplicationErrors from "../error-handler/applicationError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApplicationErrors) {
    logger.error(err.logMessage);
    return res.status(err.statusCode).json({
      message: err.message, // Send the custom error message to the user
      success: false,
    });
  } else if (err instanceof mongoose.Error.ValidationError) {
    // if any validation errors occur from mongoose
    logger.error(err.logMessage);
    return res.status(BAD_REQUEST_CODE).json({
      message: err.message, // Send the custom error message to the user
      success: false,
    });
  }

  return res.status(INTERNAL_SERVER_ERROR_CODE).json({
    message: "Oops! Something went wrong... Please try again later!",
    success: false,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
