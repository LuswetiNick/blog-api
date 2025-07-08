import login from "@/controllers/v1/auth/login";
import register from "@/controllers/v1/auth/register";
import validationError from "@/middlewares/validation-error";
import User from "@/models/user";
import { Router } from "express";
import { body, cookie } from "express-validator";
import bcrypt from "bcrypt";
import refreshToken from "@/controllers/v1/auth/refresh-token";

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
      const userExists = await User.exists({ email: value });
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

router.post(
  "/login",
  body("email")
    .notEmpty()
    .trim()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters long")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (!userExists) {
        throw new Error("Invalid email or password");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email })
        .select("password")
        .lean()
        .exec();
      if (!user) {
        throw new Error("Invalid email or password");
      }
      const passwordMatch = await bcrypt.compare(value, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid email or password");
      }
    }),
  validationError,
  login,
);
router.post(
  "/refresh-token",
  cookie("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .isJWT()
    .withMessage("Invalid refresh token"),
  validationError,
  refreshToken,
);

export default router;
