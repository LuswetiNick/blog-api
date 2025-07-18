import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import Token from "@/models/token";
import type { Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Types } from "mongoose";

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;
  try {
    const tokenExists = await Token.exists({ token: refreshToken });
    if (!tokenExists) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
      });
      return;
    }
    // Verify refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };
    const accessToken = generateAccessToken(jwtPayload.userId);
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Refresh token expired",
      });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
      });
      return;
    }
    res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Failed to refresh token:", error);
  }
};

export default refreshToken;
