import express from "express";
import { UserController } from "@api/controller/user.controller";
import { HttpRequestValidator } from "@middleware/http-request-validator";
import { cmsUser } from "@api/validator/user.validator";
import { AuthenticateRequest } from "@middleware/authenticate-request";

class UserRoutes {
  public router: express.Router = express.Router();
  private userController: UserController;
  private httpRequestValidator: HttpRequestValidator;
  private authenticate;

  constructor() {
    this.userController = new UserController();
    this.httpRequestValidator = new HttpRequestValidator();
    const authMiddleware = new AuthenticateRequest();
    this.authenticate = authMiddleware.validate;
    this.assign();
  }

  private assign(): void {
    this.router.post(
      "/login",
      this.httpRequestValidator.validate("body", cmsUser),
      this.userController.login
    );

    this.router.post(
      "/register",
      this.httpRequestValidator.validate("body", cmsUser),
      this.userController.register
    );

    this.router.post(
      "/start-game",
      this.authenticate,
      this.userController.startGame
    );
  }
}

export default new UserRoutes().router;
