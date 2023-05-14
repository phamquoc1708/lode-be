import mongoose, { PaginateModel } from "mongoose";
import { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface BankDeposit {
  branchBank: string;
  numberBank: string;
  bank: string;
  ownBank: string;
  qrBank: string;
}

const BankDepositSchema = new mongoose.Schema<BankDeposit>(
  {
    numberBank: {
      type: String,
      required: true,
    },
    bank: {
      type: String,
      required: true,
    },
    ownBank: {
      type: String,
      required: true,
    },
    qrBank: {
      type: String,
    },
    branchBank: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "Banks",
  }
);

BankDepositSchema.plugin(mongoosePaginate);

export type BankDepositDoc = BankDeposit & Document;

export const BankDepositModel = mongoose.model<BankDepositDoc>("BankDeposit", BankDepositSchema, "BankDeposit") as PaginateModel<BankDepositDoc>;
