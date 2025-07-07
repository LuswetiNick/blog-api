import { Router } from "express";

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

export default router;
