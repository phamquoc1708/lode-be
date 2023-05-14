import { PaginateModel } from "mongoose";
import { BankDoc } from "@/src/user/schemas/bank.schema";
import { ConsumerBankAccountInput } from "../types/consumer.types";
import { BankWithdrawDoc } from "../schemas/bankWithdraw.schema";
import { BankDepositDoc } from "../schemas/bankDeposit.schema";

export class BankService {
  constructor(
    public model: PaginateModel<BankDoc>,
    public modelBankWithdraw: PaginateModel<BankWithdrawDoc>,
    public modelBankDeposit: PaginateModel<BankDepositDoc>
  ) {}

  async createBankAccount(userId: string, payload: ConsumerBankAccountInput) {
    return await this.model.create({ userId, ...payload });
  }

  async getListBankAccount(userId: string, paginate: object) {
    return await this.model.paginate({ userId }, { ...paginate });
  }

  async deleteBank(userId: string) {
    return await this.model.deleteMany({ userId });
  }

  async getBankWithdraw() {
    return await this.modelBankWithdraw.find({});
  }

  async getBankDeposit() {
    return await this.modelBankDeposit.find({});
  }
}
