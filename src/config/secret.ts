import { config as dotenvConfig } from "dotenv";

dotenvConfig();
export const {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  ENVIRONMENT,
  TIMEZONE = "UTC",
  SOCKET_PORT,
} = process.env;
