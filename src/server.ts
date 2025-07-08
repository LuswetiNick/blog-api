import express from "express";
import env from "./config/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import corsOptions from "./config/cors-options";
import limiter from "./lib/express-rate-limit";

import v1 from "./routes/v1";
import { connectToDB, disconnectFromDB } from "./lib/mongoose";
import { logger } from "./lib/winston";

const app = express();

// CORS Middleware
app.use(cors(corsOptions));

// JSON Parsing
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Response compression
app.use(compression({ threshold: 1024 }));

app.use(helmet());

// Rate Limiting
app.use(limiter);

(async () => {
  try {
    await connectToDB();
    app.use("/api/v1", v1);

    app.listen(env.PORT, () => {
      logger.info(`Server is running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    if (env.NODE_ENV === "production") {
      logger.info("Shutting down the server...");
      process.exit(1);
    }
  }
})();

// Server Shutdown
const handleServerShutdown = async () => {
  try {
    await disconnectFromDB();
    logger.info("Shutting down the server...");
    process.exit(0);
  } catch (error) {
    logger.error("Failed to shut down the server:", error);
    process.exit(1);
  }
};

// Handle SIGINT and SIGTERM signals
process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
