import jwt from "jsonwebtoken";
import { BAD_REQUEST_CODE, UNAUTHORIZED_CODE } from "../config/statusCode.js";
import ApplicationError from "../error-handler/applicationError.js";
import User from "../features/user/user.schema.js";

const jwtAuthMiddleware = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ success: false, error: "Access denied. No token provided." });
  }

  try {
    token = token.replace("bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const haveUser = await User.findOne({ loginToken: { $in: [token] } });
    if (!haveUser) {
      return res
        .status(UNAUTHORIZED_CODE)
        .send({ success: false, error: "Token expired." });
    }
    req.user = { token, ...decoded };
    next();
  } catch (err) {
    console.log(err.message);
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ success: false, error: "Invalid token." });
  }
};

export default jwtAuthMiddleware;
