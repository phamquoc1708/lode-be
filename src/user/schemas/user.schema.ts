import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const STATUS_USER = {
  VERIFIED: "VERIFIED",
  UNVERIFIED: "UNVERIFIED",
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
  password?: string;
  status?: string;
  role?: string;
}

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
    password: {
      type: String,
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
      enum: ROLE_CONSUMER,
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
