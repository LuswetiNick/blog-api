import env from "@/config/env";
import mongoose from "mongoose";
import type { ConnectOptions } from "mongoose";

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
    console.log("Connected to Database successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log("Failed to connect to Database", error);
  }
};

// disconnect DB
export const disconnectFromDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from Database successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log("Failed to disconnect from Database", error);
  }
};
