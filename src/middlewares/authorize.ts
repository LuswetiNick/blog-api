import { logger } from "@/lib/winston";
import User from "@/models/user";
import type { Request, Response, NextFunction } from "express";

export type AuthRole = "admin" | "user";

const authorize = (role: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
      const user = await User.findById(userId).select("role").exec();
      if (!user) {
        res.status(404).json({
          code: "NOT_FOUND",
          message: "User not found",
        });
        return;
      }
      if (!role.includes(user.role)) {
        res.status(403).json({
          code: "FORBIDDEN",
          message: "You don't have permission to access this resource",
        });
        return;
      }
      return next();
    } catch (error) {
      res.status(500).json({
        code: "SERVER_ERROR",
        message: "Internal Server Error",
        error: error,
      });
      logger.error("Failed to authorize user:", error);
    }
  };
};

export default authorize;
