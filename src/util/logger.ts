import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Define custom log format
const customFormat = printf(
  ({
    level,
    message,
    metadata,
  }: {
    level: string;
    message: string;
    timestamp: string;
    metadata: any;
  }) => {
    let msg = `${timestamp} [${level}] : ${message} `;
    if (metadata && Object.keys(metadata).length) {
      msg += JSON.stringify(metadata);
    }
    return msg;
  }
);

// Create logger instance
const logger = createLogger({
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log" }),
  ],
  level: "debug", // Set default log level
});

// Info logging function
export const logInfo = (message: string, data?: any): void => {
  if (data) {
    logger.info(message, data);
  } else {
    logger.info(message);
  }
};

// Error logging function
export const logError = (message: string, data?: any): void => {
  if (data) {
    logger.error(message, data);
  } else {
    logger.error(message);
  }
};

// Debug logging function
export const logDebug = (message: string, data?: any): void => {
  if (data) {
    logger.debug(message, data);
  } else {
    logger.debug(message);
  }
};

// Export the logger instance if you need direct access
export default logger;
