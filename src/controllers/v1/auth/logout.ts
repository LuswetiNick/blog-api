import env from "@/config/env";
import { logger } from "@/lib/winston";
import Token from "@/models/token";
import type { Request, Response } from "express";

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });
      logger.info("User refresh token deleted", {
        userId: req.userId,
        token: refreshToken,
      });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.sendStatus(204);
    logger.info("User logged out successfully", {
      userId: req.userId,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Failed to logout user:", error);
  }
};

export default logout;
