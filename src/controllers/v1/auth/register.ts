import env from "@/config/env";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import Token from "@/models/token";
import type { IUser } from "@/models/user";
import User from "@/models/user";
import { generateUsername } from "@/utils";
import type { Request, Response } from "express";

type UserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;
  if (role === "admin" && !env.WHITELIST_ADMINS_EMAIL.includes(email)) {
    res.status(403).json({
      code: "FORBIDDEN",
      message: "Forbidden to register as admin",
    });
    logger.warn(
      `User with email ${email} is trying to register as admin but not in the whitelist`,
    );
    return;
  }

  try {
    const username = generateUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });
    //TODO: Generate access and refresh token
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Save refresh token to database
    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info("Refresh token saved to database:", {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
    logger.info("User registered successfully:", {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Failed to register user:", error);
  }
};

export default register;
