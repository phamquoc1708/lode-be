require("dotenv").config();
import mongoose, { PaginateModel } from "mongoose";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import tokenUntil from "@/src/utils/token";
import { UserDoc } from "@/src/user/schemas/user.schema";
import { ConsumerBankAccountInput, ConsumerBetInput, ConsumerLoginInput, ConsumerRegisterInput, ConsumerMoneyInput } from "@/src/user/types/consumer.types";
import { AppError } from "@/src/utils/error";
import { TokenService } from "./token.service";
import { getInfoData } from "@/src/utils/getInfo";
import { BankService } from "./bank.service";

export class UserService {
  constructor(public model: PaginateModel<UserDoc>, private tokenService: TokenService, private bankService: BankService) {}

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

  async getMyProfile(userId: string) {
    const user = await this.model.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Can't find profile");
    }

    return getInfoData({ fields: ["username", "displayName", "phone", "role", "totalMoney", "fullName"], object: user });
  }

  async logout(userId: string) {
    await this.tokenService.deleteToken(userId);
    return;
  }

  async createBankAccount(userId: string, payload: ConsumerBankAccountInput) {
    const user = await this.model.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");
    }
    return await this.bankService.createBankAccount(user._id.toString(), payload);
  }

  async getBankAccount(userId: string, paginate: object) {
    const user = await this.model.findById(userId);
    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");
    }
    return await this.bankService.getListBankAccount(user._id.toString(), paginate);
  }

  async getBankWithdraw() {
    return await this.bankService.getBankWithdraw();
  }

  async getBankDeposit() {
    return await this.bankService.getBankDeposit();
  }

  async createBet(userId: string, payload: ConsumerBetInput) {
    return await this.model.findOneAndUpdate({ _id: userId }, { $push: { historyBet: payload } });
  }

  async getHistoryBet(userId: string) {
    const user = await this.model.findOne({ _id: userId }).exec();
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");

    return getInfoData({ fields: ["username", "historyBet"], object: user });
  }

  async addMoney(userId: string, payload: ConsumerMoneyInput) {
    const user = await this.model.findOne({ _id: userId }).exec();
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");
    return await this.model.findOneAndUpdate({ _id: userId }, { $push: { historyMoney: { ...payload, bank: new mongoose.Types.ObjectId(payload.bank) } } });
  }

  async getHistoryMoney(userId: string, limit: number) {
    const user = await this.model
      .findOne({ _id: userId })
      .populate([
        {
          path: "historyMoney.bank",
        },
      ])
      .exec();
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");

    return user.historyMoney.slice(0, limit);
  }
}
