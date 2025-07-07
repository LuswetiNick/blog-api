import type { CorsOptions } from "cors";
import env from "./env";

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      env.NODE_ENV === "development" ||
      !origin ||
      env.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`Not allowed by CORS: ${origin} is not allowed`),
        false,
      );
    }
  },
};

export default corsOptions;
