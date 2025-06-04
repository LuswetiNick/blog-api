import cors from "cors";
import express from "express";

import corsOptions from "./config/cors-options";
import { config } from "./config/env";

const app = express();

// Middleware
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port: http://localhost:${config.PORT}`);
});
