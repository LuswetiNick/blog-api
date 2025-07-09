import deleteCurrentUser from "@/controllers/v1/user/delete-user";
import getCurrentUser from "@/controllers/v1/user/get-current-user";
import updateCurrentUser from "@/controllers/v1/user/update-current-user";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validation-error";
import User from "@/models/user";
import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  getCurrentUser,
);
router.put(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  body("username")
    .trim()
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("Username must be at most 50 characters long")
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });
      if (userExists) {
        throw new Error("Username already exists");
      }
    }),
  body("email")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters long")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const userEmailExists = await User.exists({ email: value });
      if (userEmailExists) {
        throw new Error("Email already exists");
      }
    }),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("First name must be at most 50 characters long"),
  body("lastName")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("Last name must be at most 50 characters long"),
  body(["website", "x", "instagram", "linkedin", "facebook"])
    .optional()
    .isURL()
    .withMessage("Invalid URL"),
  validationError,
  updateCurrentUser,
);
router.delete(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  deleteCurrentUser,
);

export default router;
