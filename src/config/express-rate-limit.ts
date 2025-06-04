import { rateLimit } from "express-rate-limit";

const rateLimitConfig = rateLimit({
  windowMs: 60000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests.Please try again after later",
  },
});

export default rateLimitConfig;
