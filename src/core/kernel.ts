import * as bodyParser from "body-parser";
import { Application } from "express";
import cors from "cors";
import i18n from "i18n";
import errorMiddleware from "@middleware/error";
import constant from "@config/constant";
import path from "path";

export class Kernel {
  public initBodyParser(app: Application): void {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
  }

  public errorMiddleware(app: Application): void {
    app.use(errorMiddleware);
  }

  public initTranslation(app: Application): void {
    i18n.configure({
      locales: [constant.ENGLISH_LOCALE, constant.SPANISH_LOCALE],
      defaultLocale: constant.ENGLISH_LOCALE,
      queryParameter: "lang",
      directory: path.join(__dirname, "..", "..", "locales"),
    });
    app.use(i18n.init);
  }

  public addCommonMiddleware(app: Application): void {
    const corsOptions = {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      allowedHeaders: "*",
      exposedHeaders: "*",
      optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
  }
}
