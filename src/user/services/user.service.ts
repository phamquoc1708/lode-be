require("dotenv").config();
import { PaginateModel } from "mongoose";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import tokenUntil from "@/src/utils/token";
import { UserDoc } from "@/src/user/schemas/user.schema";
import { ConsumerLoginInput, ConsumerRegisterInput } from "@/src/user/types/consumer.types";
import { AppError } from "@/src/utils/error";
import { TokenService } from "./token.service";

export class UserService {
  constructor(public model: PaginateModel<UserDoc>, private tokenService: TokenService) {}

  async register(payload: ConsumerRegisterInput) {
    const consumer = await this.model.findOne({ username: payload.username });
    if (consumer) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Tên đăng nhập đã tồn tại");
    }

    const passwordHash = bcrypt.hashSync(payload.password, bcrypt.genSaltSync());
    payload.password = passwordHash;
    const user = await this.model.create(payload);
    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "The registration process has a problem, please try again");
    }

    const keyToken = crypto.randomBytes(64).toString("hex");
    const keyStore = await this.tokenService.storeKeyToken(user._id.toString(), keyToken);

    if (!keyStore) {
      throw new AppError(StatusCodes.BAD_REQUEST, "The registration process has a problem, please try again");
    }
    const token = tokenUntil.generateToken({ userId: user._id, username: user.username }, keyToken, process.env.EXPIRES_IN_TOKEN);

    return { token };
  }

  async login(payload: ConsumerLoginInput) {
    const user = await this.model.findOne({ username: payload.username });
    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Tên đăng nhập hoặc mật khẩu không đúng");
    }

    const isMatchPassword = bcrypt.compareSync(payload.password, user.password as string);
    if (!isMatchPassword) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Tên đăng nhập hoặc mật khẩu không đúng");
    }
    const keyToken = crypto.randomBytes(64).toString("hex");
    const keyStore = await this.tokenService.storeKeyToken(user._id.toString(), keyToken);
    if (!keyStore) {
      throw new AppError(StatusCodes.BAD_REQUEST, "The registration process has a problem, please try again");
    }
    const token = tokenUntil.generateToken({ userId: user._id, username: user.username }, keyToken, process.env.EXPIRES_IN_TOKEN);
    return { token };
  }
}
