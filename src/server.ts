import { PORT } from "./config/secret";
// import { connect } from "./database/db-connection";

/* eslint-disable */
import app from "./app";
import logger from "@util/logger";

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string | boolean | number {
  const portVal = parseInt(val, 10);

  if (isNaN(portVal)) {
    // named pipe
    return val;
  }

  if (portVal >= 0) {
    // port number
    return portVal;
  }

  return false;
}

/**
 * Set HTTP port for application
 */

const port = normalizePort(PORT || "3001");
app.set("port", port);

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), async () => {
  logger.info(
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`,
    "server.ts"
  );
  // await connect();
  logger.info("Press CTRL-C to stop", "server.ts");
});

export default server;
