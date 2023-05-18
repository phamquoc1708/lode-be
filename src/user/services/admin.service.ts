import { STATUS_MONEY, TYPE_BANK } from "./../schemas/user.schema";
import { PaginateModel } from "mongoose";
import { UserDoc } from "../schemas/user.schema";
import { TokenService } from "./token.service";
import { BankService } from "./bank.service";
import { AdminDepositInput } from "../types/admin.types";

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
    ]);
    console.log(result);
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
}
