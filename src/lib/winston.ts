import env from "@/config/env";
import winston from "winston";

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

// console transport(development)
if (env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
        align(),
        printf(({ level, message, timestamp, ...meta }) => {
          const msg = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : "";
          return `${timestamp} | [${level}]: ${message}${msg}`;
        }),
      ),
    }),
  );
}

// Logger
const logger = winston.createLogger({
  level: env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: env.NODE_ENV === "test",
});

export { logger };
