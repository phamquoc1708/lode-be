import { BankWithdraw } from "./bankWithdraw.schema";
import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const STATUS_USER = {
  VERIFIED: "VERIFIED",
  UNVERIFIED: "UNVERIFIED",
};

const REGION = ["Miền Bắc", "Miền Trung", "Miền Nam"];

export const STATUS_BET = {
  WAITING: "WAITING",
  WIN: "WIN",
  LOSE: "LOSE",
};

const TYPE_BET = ["Đánh lô", "3 càng", "Đánh đề ", "Đầu đuôi", "Lô xiên"];

export const STATUS_MONEY = {
  WAITING: "WAITING",
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
};

export const FORMALITY_BANK = {
  BANKING: "Chuyển khoản",
};

export const TYPE_BANK = {
  NAP: "Nạp",
  RUT: "Rút",
};

export const ROLE_CONSUMER = {
  ADMIN: "ADMIN",
  SUP_ADMIN: "SUP_ADMIN",
  CONSUMER: "CONSUMER",
};

export interface User {
  username?: string;
  displayName?: string;
  phone?: string;
  fullName?: string;
  totalMoney?: number;
  password?: string;
  status?: string;
  role?: string;
  listBank?: Array<any>;
  historyBet?: any;
  historyMoney?: any;
}

const HistoryBet = new mongoose.Schema(
  {
    bonus: {
      type: Number,
      default: 0,
    },
    moneyBet: {
      type: Number,
      default: 0,
    },
    numberBet: {
      type: String,
    },
    gameBet: {
      type: String,
    },
    miniGameBet: {
      type: String,
    },
    region: {
      type: String,
      enum: REGION,
    },
    dai: {
      type: String,
    },
    moneyOneNumber: {
      type: Number,
      default: 0,
    },
    winOneNumber: {
      type: Number,
      default: 0,
    },
    totalNumberWin: {
      type: Number,
      default: 1,
    },
    dateBet: {
      type: String,
    },
    totalMoneyGetAfterBet: {
      type: Number,
      default: 0,
    },
    ratio: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: [STATUS_BET.WAITING, STATUS_BET.WIN, STATUS_BET.LOSE],
      default: STATUS_BET.WAITING,
    },
  },
  {
    timestamps: true,
  }
);

const HistoryMoney = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [TYPE_BANK.NAP, TYPE_BANK.RUT],
    },
    bank: {
      type: mongoose.Schema.Types.Mixed,
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    formalityBank: {
      type: String,
      enum: [FORMALITY_BANK.BANKING],
      default: FORMALITY_BANK.BANKING,
    },
    codeTransfer: {
      type: String,
    },
    note: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      default: STATUS_MONEY.WAITING,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      unique: true,
    },
    displayName: {
      type: String,
    },
    phone: {
      type: String,
      default: null,
    },
    totalMoney: {
      type: Number,
      required: true,
      default: 0,
    },
    fullName: {
      type: String,
    },
    password: {
      type: String,
    },
    historyBet: {
      type: [
        {
          type: HistoryBet,
        },
      ],
    },
    historyMoney: {
      type: [
        {
          type: HistoryMoney,
        },
      ],
    },
    status: {
      type: String,
      required: true,
      enum: [STATUS_USER.UNVERIFIED, STATUS_USER.VERIFIED],
      default: STATUS_USER.UNVERIFIED,
    },
    role: {
      type: String,
      required: true,
      enum: [ROLE_CONSUMER.ADMIN, ROLE_CONSUMER.SUP_ADMIN, ROLE_CONSUMER.CONSUMER],
      default: "CONSUMER",
    },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

userSchema.plugin(mongoosePaginate);

export type UserDoc = User & Document;

export const UserModel = mongoose.model<UserDoc>("User", userSchema, "users") as PaginateModel<UserDoc>;
