import { body } from "express-validator";
import { handleValidationResponse } from "../../utils/common.js";

const commentValidation = async (req, res, next) => {
  const rules = [];
  rules.push(
    body("text")
      .notEmpty()
      .withMessage("Comments is required")
      .isString()
      .withMessage("Comments should be string")
  );

  await Promise.all(rules.map((rule) => rule.run(req)));
  return handleValidationResponse(req, res, next);
};

export default commentValidation;
