import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: [
    "http://localhost:3000",
    "https://blog-api-docs.vercel.app",
  ],
  MONGODB_URI: process.env.MONGODB_URI,
};

export default env;
