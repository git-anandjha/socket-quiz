import { Request, Response } from "express";
import i18n from "i18n";
import { ResponseParser } from "@util/response-parser";
import constant from "@config/constant";
import { UserService } from "@service/user.service";

export class UserController {
  private responseParser: ResponseParser;
  private userService: UserService;

  constructor() {
    this.responseParser = new ResponseParser();
    this.userService = new UserService();
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @returns void
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const {
      body: { email, password },
    } = req;
    const response = await this.userService.login(email, password);
    this.responseParser
      .setStatus(true)
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @returns void
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    const {
      body: { email, password },
    } = req;
    const response = await this.userService.register(email, password);
    this.responseParser
      .setStatus(true)
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @returns void
   */
  public startGame = async (req: Request, res: Response): Promise<void> => {
    const {
      body: { gameId },
    } = req;
    const response = await this.userService.startGame(gameId);
    this.responseParser
      .setStatus(true)
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };
}
