import { logger } from "@/lib/winston";
import User from "@/models/user";

import type { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-__v").lean().exec();
    if (!user) {
      res.status(404).json({
        code: "NOT_FOUND",
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Failed to get current user:", error);
  }
};

export default getCurrentUser;
