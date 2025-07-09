/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import type { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import type { Types } from "mongoose";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Access denied. No token provided.",
    });
    return;
  }
  const [_, token] = authHeader.split(" ");
  try {
    const jwtPayload = verifyAccessToken(token) as {
      userId: Types.ObjectId;
    };
    req.userId = jwtPayload.userId;
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Access token expired",
      });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid access token",
      });
      return;
    }
    res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Failed to authenticate user:", error);
  }
};
export default authenticate;
