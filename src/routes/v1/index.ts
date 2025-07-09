import { Router } from "express";

import authRoutes from "./auth";
import userRoutes from "./user";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Blog API is Live!",
    status: "success",
    version: "1.0.0",
    docs: "https://blog-api-docs.vercel.app",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
