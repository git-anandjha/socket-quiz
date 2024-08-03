import express from "express";
import "express-async-errors";
import "module-alias/register";
import { Routes } from "@api/route";
import { unhandledExceptionHandler } from "@util/unhandled-exception";
import { connect } from "@database/db-connection";
import { Kernel } from "./core/kernel";

class App {
  public app: express.Application = express();
  private kernel: Kernel = new Kernel();
  private router: Routes = new Routes();

  constructor() {
    this.initMiddlewares();
  }

  private async initMiddlewares(): Promise<void> {
    this.kernel.initBodyParser(this.app);
    this.kernel.addCommonMiddleware(this.app);
    await connect();
    this.kernel.initTranslation(this.app);
    this.router.routes(this.app);
    this.kernel.errorMiddleware(this.app);
    unhandledExceptionHandler();
  }
}

export default new App().app;
