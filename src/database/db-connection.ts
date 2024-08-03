import mongoose from "mongoose";
import { MONGO_URI } from "@config/secret";
import logger from "@util/logger";
import "../game-server/gameServer";

export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("connected", {
      message: "Successfully connected to the database",
    });
  } catch (error) {
    logger.error(
      "connection_error",
      {
        message: "Error connecting to the database",
      },
      error
    );
  }
};
