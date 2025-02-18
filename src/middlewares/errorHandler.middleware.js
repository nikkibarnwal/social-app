import {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "../config/statusCode.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || INTERNAL_SERVER_ERROR_CODE;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // 🔥 Catch Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = BAD_REQUEST_CODE;
    errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
    message = "Validation Failed";
  }
  // 🔥 Handle MongoDB Duplicate Key Error (Unique Email)
  if (err.code === 11000 && err.keyPattern?.email) {
    statusCode = BAD_REQUEST_CODE;
    message = "Email already exists";
    errors = { email: "This email is already registered" };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors, // Contains field-specific error messages
  });
};
