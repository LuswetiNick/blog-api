import type { CorsOptions } from "cors";
import { config } from "./env";

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false
      );
      console.log(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

export default corsOptions;
