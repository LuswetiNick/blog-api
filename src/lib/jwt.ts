import env from "@/config/env";
import jwt from "jsonwebtoken";

import { Types } from "mongoose";

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    subject: "accessToken",
  });
};
export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    subject: "refreshToken",
  });
};
