import { STATUS_BET, STATUS_MONEY, TYPE_BANK } from "./../schemas/user.schema";
import mongoose, { PaginateModel } from "mongoose";
import { UserDoc } from "../schemas/user.schema";
import { TokenService } from "./token.service";
import { BankService } from "./bank.service";
import { AdminBetInput, AdminDepositInput } from "../types/admin.types";
import { AppError } from "@/src/utils/error";
import { StatusCodes } from "http-status-codes";

export class AdminService {
  constructor(public model: PaginateModel<UserDoc>, private bankService: BankService) {}

  async getListBankWaiting() {
    const result = await this.model.aggregate([
      {
        $match: {
          "historyMoney.status": "WAITING",
        },
      },
      {
        $project: {
          username: 1,
          historyMoney: {
            $filter: {
              input: "$historyMoney",
              as: "money",
              cond: { $eq: ["$$money.status", "WAITING"] },
            },
          },
        },
      },
      {
        $unwind: "$historyMoney",
      },
      {
        $sort: {
          "historyMoney.createdAt": -1, // Sort in ascending order (use -1 for descending order)
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          historyMoney: { $push: "$historyMoney" },
        },
      },
    ]);
    const data: Array<any> = [];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].historyMoney.length; j++) {
        data.push({
          _id: result[i].historyMoney[j]._id,
          username: result[i].username,
          type: result[i].historyMoney[j].type,
          bank: result[i].historyMoney[j].bank,
          totalMoney: result[i].historyMoney[j].totalMoney,
          formalityBank: result[i].historyMoney[j].formalityBank,
          codeTransfer: result[i].historyMoney[j].codeTransfer,
          note: result[i].historyMoney[j].note,
        });
      }
    }
    return data;
  }

  async getListBankDone() {
    const result = await this.model.aggregate([
      {
        $match: {
          "historyMoney.status": { $in: ["FAIL", "SUCCESS"] },
        },
      },
      {
        $project: {
          username: 1,
          historyMoney: {
            $filter: {
              input: "$historyMoney",
              as: "money",
              cond: { $in: ["$$money.status", ["FAIL", "SUCCESS"]] },
            },
          },
        },
      },
      {
        $unwind: "$historyMoney",
      },
      {
        $sort: {
          "historyMoney.createdAt": -1, // Sort in ascending order (use -1 for descending order)
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          historyMoney: { $push: "$historyMoney" },
        },
      },
    ]);
    const data: Array<any> = [];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].historyMoney.length; j++) {
        data.push({
          _id: result[i].historyMoney[j]._id,
          username: result[i].username,
          type: result[i].historyMoney[j].type,
          status: result[i].historyMoney[j].status,
          bank: result[i].historyMoney[j].bank,
          totalMoney: result[i].historyMoney[j].totalMoney,
          formalityBank: result[i].historyMoney[j].formalityBank,
          codeTransfer: result[i].historyMoney[j].codeTransfer,
          note: result[i].historyMoney[j].note,
        });
      }
    }
    return data;
  }

  async acceptDeposit(payload: AdminDepositInput) {
    try {
      return await this.model.findOneAndUpdate(
        { username: payload.username, "historyMoney._id": payload.depositId },
        { $set: { "historyMoney.$.status": STATUS_MONEY.SUCCESS, "historyMoney.$.note": "OK" } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async rejectDeposit(payload: AdminDepositInput) {
    try {
      return await this.model.findOneAndUpdate(
        { username: payload.username, "historyMoney._id": payload.depositId },
        { $set: { "historyMoney.$.status": STATUS_MONEY.FAIL, "historyMoney.$.note": "Vui lòng thử lại. Hoặc liên hệ chúng tôi" } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getListBetWaiting() {
    const result = await this.model.aggregate([
      {
        $match: {
          "historyBet.status": "WAITING",
        },
      },
      {
        $project: {
          username: 1,
          historyBet: {
            $filter: {
              input: "$historyBet",
              as: "bet",
              cond: { $eq: ["$$bet.status", "WAITING"] },
            },
          },
        },
      },
      {
        $unwind: "$historyBet",
      },
      {
        $sort: {
          "historyBet.createdAt": -1, // Sort in ascending order (use -1 for descending order)
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          historyBet: { $push: "$historyBet" },
        },
      },
    ]);
    const data: Array<any> = [];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].historyBet.length; j++) {
        data.push({
          _id: result[i].historyBet[j]._id,
          username: result[i].username,
          moneyBet: result[i].historyBet[j].moneyBet,
          numberBet: result[i].historyBet[j].numberBet,
          gameBet: result[i].historyBet[j].gameBet,
          miniGameBet: result[i].historyBet[j].miniGameBet,
          region: result[i].historyBet[j].region,
          dai: result[i].historyBet[j].dai,
          moneyOneNumber: result[i].historyBet[j].moneyOneNumber,
          winOneNumber: result[i].historyBet[j].winOneNumber,
          totalNumberWin: result[i].historyBet[j].totalNumberWin,
          dateBet: result[i].historyBet[j].dateBet,
          ratio: result[i].historyBet[j].ratio,
          status: result[i].historyBet[j].status,
        });
      }
    }
    return data;
  }

  async getListBetDone() {
    const result = await this.model.aggregate([
      {
        $match: {
          "historyBet.status": { $in: ["WIN", "LOSE"] },
        },
      },
      {
        $project: {
          username: 1,
          historyBet: {
            $filter: {
              input: "$historyBet",
              as: "bet",
              cond: { $in: ["$$bet.status", ["LOSE", "WIN"]] },
            },
          },
        },
      },
      {
        $unwind: "$historyBet",
      },
      {
        $sort: {
          "historyBet.createdAt": -1, // Sort in ascending order (use -1 for descending order)
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          historyBet: { $push: "$historyBet" },
        },
      },
    ]);
    const data: Array<any> = [];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].historyBet.length; j++) {
        data.push({
          _id: result[i].historyBet[j]._id,
          username: result[i].username,
          moneyBet: result[i].historyBet[j].moneyBet,
          numberBet: result[i].historyBet[j].numberBet,
          gameBet: result[i].historyBet[j].gameBet,
          miniGameBet: result[i].historyBet[j].miniGameBet,
          region: result[i].historyBet[j].region,
          dai: result[i].historyBet[j].dai,
          moneyOneNumber: result[i].historyBet[j].moneyOneNumber,
          winOneNumber: result[i].historyBet[j].winOneNumber,
          totalNumberWin: result[i].historyBet[j].totalNumberWin,
          totalMoneyGetAfterBet: result[i].historyBet[j].totalMoneyGetAfterBet,
          dateBet: result[i].historyBet[j].dateBet,
          ratio: result[i].historyBet[j].ratio,
          status: result[i].historyBet[j].status,
        });
      }
    }
    return data;
  }

  async winBet(payload: AdminBetInput) {
    try {
      const user = await this.model.findOne({
        username: payload.username,
      });
      if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Not found user");

      for (let i = 0; i < user.historyBet.length; i++) {
        if (user.historyBet[i]._id.toString() === payload.betId) {
          user.historyBet[i].status = STATUS_BET.WIN;
          user.historyBet[i].totalMoneyGetAfterBet = Math.ceil(
            user.historyBet[i].moneyOneNumber * user.historyBet[i].winOneNumber * user.historyBet[i].totalNumberWin
          );
        }
      }
      await user.save();
      return;
    } catch (err) {
      console.log(err);
    }
  }

  async loseBet(payload: AdminBetInput) {
    const user = await this.model.findOne({
      username: payload.username,
    });
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "Not found user");

    for (let i = 0; i < user.historyBet.length; i++) {
      if (user.historyBet[i]._id.toString() === payload.betId) {
        user.historyBet[i].status = STATUS_BET.LOSE;
      }
    }
    await user.save();
    return;
  }
}
