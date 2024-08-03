import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import createError from "http-errors";
import { JWT_SECRET, TIMEZONE } from "@config/secret";
import { User } from "@database/model/user.model";
import i18n from "i18n";
import moment from "moment-timezone";
import { sendFirstQuestion } from "../game-server/gameServer";

export class UserService {
  constructor() {
    moment.tz.setDefault(TIMEZONE);
  }

  public async login(email: string, password: string): Promise<any> {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw createError(401, i18n.__("Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createError(401, i18n.__("Invalid email or password"));
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    return { user, token };
  }

  public async register(email: string, password: string): Promise<any> {
    const user = await User.findOne({
      email,
    });
    if (user) {
      throw createError(400, i18n.__("Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
    return { user: newUser, token };
  }

  public async startGame(gameId: string): Promise<void> {
    await sendFirstQuestion(gameId);
  }
}
