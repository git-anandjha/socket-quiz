import { Application } from "express";

import { AuthenticateRequest } from "@middleware/authenticate-request";

import UserRoutes from "./user.route";

export class Routes {
  private authenticate;
  constructor() {
    const authMiddleware = new AuthenticateRequest();
    this.authenticate = authMiddleware.validate;
  }
  public routes(app: Application): void {
    // resource and routes mapping comes here
    app.use("/user", UserRoutes);
  }
}
