import { body, validationResult } from "express-validator";
import { handleValidationResponse } from "../../utils/common.js";

const postValidationMiddleware = async (req, res, next) => {
  const rules = [];
  rules.push(
    body("caption")
      .notEmpty()
      .withMessage("Caption is required")
      .isString()
      .withMessage("Caption should be string")
  );
  await Promise.all(rules.map((rule) => rule.run(req)));
  // check validation result
  return handleValidationResponse(req, res, next);
};

export default postValidationMiddleware;
