import jwt from "jsonwebtoken";
import { BAD_REQUEST_CODE, UNAUTHORIZED_CODE } from "../config/statusCode.js";
import ApplicationError from "../error-handler/applicationError.js";

const jwtAuthMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ success: false, error: "Access denied. No token provided." });
  }

  try {
    token = token.replace("bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    throw new ApplicationError("Invalid token.", BAD_REQUEST_CODE, ex.message);
  }
};

export default jwtAuthMiddleware;
