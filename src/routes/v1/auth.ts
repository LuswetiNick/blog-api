import register from "@/controllers/v1/auth/register";
import validationError from "@/middlewares/validation-error";
import user from "@/models/user";
import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  body("email")
    .notEmpty()
    .trim()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters long")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const userExists = await user.exists({ email: value });
      if (userExists) {
        throw new Error("User email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["admin", "user"])
    .withMessage("Invalid role Role must be admin or user"),
  validationError,
  register,
);

export default router;
