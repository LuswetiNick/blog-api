import env from "@/config/env";
import mongoose from "mongoose";
import type { ConnectOptions } from "mongoose";
import { logger } from "./winston";

const clientOptions: ConnectOptions = {
  dbName: "bloggy",
  appName: "Blog API",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

// Connect to Mongo DB
export const connectToDB = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    throw new Error("Please provide a valid MongoDB URI");
  }

  try {
    await mongoose.connect(env.MONGODB_URI, clientOptions);
    logger.info("Connected to Database successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error("Failed to connect to Database", error);
  }
};

// disconnect DB
export const disconnectFromDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from Database successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error("Failed to disconnect from Database", error);
  }
};
