import env from "@/config/env";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import Token from "@/models/token";
import type { IUser } from "@/models/user";
import User from "@/models/user";
import type { Request, Response } from "express";

type UserData = Pick<IUser, "email" | "password">;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as UserData;
    const user = await User.findOne({ email })
      .select("username email password role")
      .lean()
      .exec();
    if (!user) {
      res.status(404).json({
        code: "NOT_FOUND",
        message: "User not found",
      });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    await Token.create({
      token: refreshToken,
      userId: user._id,
    });
    logger.info("Refresh token saved to database:", {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    logger.info("User logged in successfully:", user);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Failed to register user:", error);
  }
};

export default login;
