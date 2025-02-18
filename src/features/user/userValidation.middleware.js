import { body } from "express-validator";
import { SIGN_IN_URL, SIGN_UP_URL } from "../../utils/apiUrl.js";
import { handleValidationResponse } from "../../utils/common.js";

const validateUser = async (req, res, next) => {
  const rules = [];
  switch (req.path) {
    case SIGN_UP_URL:
      rules.push(
        body("name")
          .isString()
          .withMessage("Name should be string")
          .notEmpty()
          .withMessage("Name is required")
          .isLength({ min: 3, max: 25 })
          .withMessage("Password must be between 3 to 25 characters"),
        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Enter valid email"),
        body("password")
          .notEmpty()
          .withMessage("Password is required")
          .isString()
          .withMessage("Password should be string")
          .isLength({ min: 6, max: 12 })
          .withMessage("Password must be between 6 to 12 characters"),
        body("gender")
          .notEmpty()
          .withMessage("Gender is required")
          .isIn(["M", "F"])
          .withMessage("Gender must be one of: F, M")
      );
      break;
    case SIGN_IN_URL:
      rules.push(
        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Enter valid email"),
        body("password")
          .notEmpty()
          .withMessage("Password is required")
          .isString()
          .withMessage("Password should be string")
          .isLength({ min: 6, max: 12 })
          .withMessage("Password must be between 6 to 12 characters")
      );
      break;

    default:
      break;
  }
  // run all rules
  await Promise.all(rules.map((rule) => rule.run(req)));
  // check validation result
  return handleValidationResponse(req, res, next);
};

export default validateUser;
