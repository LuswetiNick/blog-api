// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
    }
  }
}
