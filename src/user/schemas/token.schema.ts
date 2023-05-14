import mongoose, { PaginateModel } from "mongoose";
import { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Token {
  userId: Schema.Types.ObjectId;
  keyToken: string;
  expires: Date;
}

const tokenSchema = new mongoose.Schema<Token>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    keyToken: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    collection: "Tokens",
  }
);

tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

tokenSchema.plugin(mongoosePaginate);

export type TokenDoc = Token & Document;

export const TokenModel = mongoose.model<TokenDoc>("Token", tokenSchema, "tokens") as PaginateModel<TokenDoc>;
