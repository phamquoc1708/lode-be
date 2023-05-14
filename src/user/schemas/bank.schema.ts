import mongoose, { PaginateModel } from "mongoose";
import { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Bank {
  userId: Schema.Types.ObjectId;
  numberBank: string;
  bank: string;
  ownBank: string;
  status: string;
}

const STATUS_BANK = {
  VERIFIED: "VERIFIED",
  NOT_VERIFIED: "NOT_VERIFIED",
};

const BankSchema = new mongoose.Schema<Bank>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
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
    status: {
      type: String,
      required: true,
      enum: STATUS_BANK,
      default: STATUS_BANK.NOT_VERIFIED,
    },
  },
  {
    timestamps: true,
    collection: "Banks",
  }
);

BankSchema.plugin(mongoosePaginate);

export type BankDoc = Bank & Document;

export const BankModel = mongoose.model<BankDoc>("Bank", BankSchema, "Banks") as PaginateModel<BankDoc>;
