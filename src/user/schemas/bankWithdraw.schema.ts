import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface BankWithdraw {
  bank: string;
  imgBank: string;
}

const BankWithdrawSchema = new mongoose.Schema<BankWithdraw>(
  {
    bank: {
      type: String,
      required: true,
    },
    imgBank: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Banks",
  }
);

BankWithdrawSchema.plugin(mongoosePaginate);

export type BankWithdrawDoc = BankWithdraw & Document;

export const BankWithdrawModel = mongoose.model<BankWithdrawDoc>("BankWithdraw", BankWithdrawSchema, "BankWithdraw") as PaginateModel<BankWithdrawDoc>;
