import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const STATUS_USER = {
  VERIFIED: "VERIFIED",
  UNVERIFIED: "UNVERIFIED",
};

const REGION = ["Miền Bắc", "Miền Trung", "Miền Nam"];

const STATUS_BET = {
  WAITING: "WAITING",
  WIN: "WIN",
  LOSE: "LOSE",
};

const TYPE_BET = ["Đánh lô", "3 càng", "Đánh đề ", "Đầu đuôi", "Lô xiên"];

const STATUS_MONEY = {
  WAITING: "WAITING",
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
};

const FORMALITY_BANK = {
  BANKING: "Chuyển khoản",
};

const TYPE_BANK = {
  NAP: "Nạp",
  RUT: "Rút",
};

const ROLE_CONSUMER = {
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
    winOrLose: {
      type: String,
      enum: ["WIN", "LOSE", "WAITING"],
      default: "WAITING",
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    typeBet: {
      type: String,
      enum: TYPE_BET,
    },
    region: {
      type: String,
      enum: REGION,
    },
    numberBet: {
      type: String,
    },
    rateBet: {
      type: Number,
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
      enum: TYPE_BANK,
    },
    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDeposit",
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
    },
    status: {
      type: String,
      required: true,
      enum: [STATUS_MONEY.WAITING, STATUS_MONEY.SUCCESS, STATUS_MONEY.FAIL],
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
