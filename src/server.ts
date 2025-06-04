import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import corsOptions from "./config/cors-options";
import { config } from "./config/env";
import rateLimitConfig from "./config/express-rate-limit";

const app = express();

// Middleware
app.use(cors(corsOptions));

// Compression to reduce payload size
app.use(
  compression({
    threshold: 1024,
  })
);
app.use(cookieParser());
app.use(helmet());

// Rate Limitng
app.use(rateLimitConfig);

// JSON Parsing
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port: http://localhost:${config.PORT}`);
});
