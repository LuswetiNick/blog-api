import dotenv from "dotenv";

import type ms from "ms";

dotenv.config();

const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: [
    "http://localhost:3000",
    "https://blog-api-docs.vercel.app",
  ],
  MONGODB_URI: process.env.MONGODB_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env
    .JWT_ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env
    .JWT_REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
  WHITELIST_ADMINS_EMAIL: ["nicklusweti@protonmail.com"],
};

export default env;
