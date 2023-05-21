require("dotenv").config();
import mongoose, { PaginateModel } from "mongoose";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

import tokenUntil from "@/src/utils/token";
import { UserDoc, TYPE_BANK, FORMALITY_BANK, STATUS_MONEY } from "@/src/user/schemas/user.schema";
import {
  ConsumerBankAccountInput,
  ConsumerBetInput,
  ConsumerLoginInput,
  ConsumerRegisterInput,
  ConsumerMoneyInput,
  ConsumerUpdateProfileInput,
  ConsumerCreateDepositInput,
  ConsumerCreateWithdrawInput,
} from "@/src/user/types/consumer.types";
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
    try {
      let totalMoney = await this.model.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        { $unwind: "$historyMoney" },
        { $match: { "historyMoney.status": { $eq: STATUS_MONEY.SUCCESS } } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [
                  { $eq: [{ $ifNull: ["$historyMoney", null] }, null] },
                  null,
                  {
                    $cond: [{ $eq: ["$historyMoney.type", TYPE_BANK.NAP] }, "$historyMoney.totalMoney", { $multiply: ["$historyMoney.totalMoney", -1] }],
                  },
                ],
              },
            },
          },
        },
      ]);

      let totalMoneyBet = await this.model.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        { $unwind: "$historyBet" },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$historyBet.totalMoneyGetAfterBet",
            },
          },
        },
      ]);

      const tempTotal = (totalMoney[0]?.total || 0) + (totalMoneyBet[0]?.total || 0);

      const user = await this.model.findOneAndUpdate({ _id: userId }, { $set: { totalMoney: tempTotal } }, { new: true });
      if (!user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Can't find profile");
      }

      return getInfoData({ fields: ["username", "displayName", "phone", "role", "totalMoney", "fullName"], object: user });
    } catch (err) {
      console.log(err);
    }
  }

  async updateProfile(userId: string, payload: ConsumerUpdateProfileInput) {
    const user = await this.model.findOneAndUpdate(
      { _id: userId },
      {
        fullName: payload.fullName,
      }
    );
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Can't find profile");
    return user;
  }

  async logout(userId: string) {
    await this.tokenService.deleteToken(userId);
    return;
  }

  async createBankAccount(userId: string, payload: ConsumerBankAccountInput) {
    const user = await this.model.findOne({ _id: userId });
    console.log(user);
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
    return await this.model.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          historyBet: {
            $each: [
              {
                ...payload,
                totalMoneyGetAfterBet: -1 * payload.moneyBet,
              },
            ],
            $position: 0,
            $slice: -50,
          },
        },
      }
    );
  }

  async getHistoryBet(userId: string) {
    const user = await this.model.findOne({ _id: userId }).exec();
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");

    return getInfoData({ fields: ["username", "historyBet"], object: user });
  }

  async addMoney(userId: string, payload: ConsumerMoneyInput) {
    const user = await this.model.findOne({ _id: userId }).exec();
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");
    const bank = await this.bankService.getBankDepositById(payload.bank);
    if (!bank) throw new AppError(StatusCodes.BAD_REQUEST, "Bank not found");
    return await this.model.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          historyMoney: {
            $each: [
              {
                ...payload,
                bank: bank,
                type: TYPE_BANK.NAP,
                formalityBank: FORMALITY_BANK.BANKING,
              },
            ],
            $position: 0,
            $slice: -20,
          },
        },
      }
    );
  }

  async getHistoryMoney(userId: string, limit: number) {
    const user = await this.model.findOne({ _id: userId });
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Can't find user");
    return user.historyMoney.slice(0, limit);
  }

  async getBankExist(userId: string, bank: string) {
    const user = await this.bankService.getBankAccount(userId, bank);
    return user;
  }

  async createBankWithdraw(userId: string, payload: ConsumerCreateWithdrawInput) {
    const bank = await this.bankService.getBankWithdrawById(payload.bank);
    if (!bank) throw new AppError(StatusCodes.BAD_REQUEST, "Bank not found");
    return await this.model.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          historyMoney: {
            $each: [
              {
                ...payload,
                bank,
                type: TYPE_BANK.RUT,
                formalityBank: FORMALITY_BANK.BANKING,
              },
            ],
            $position: 0,
            $slice: -20,
          },
        },
      }
    );
  }
}
