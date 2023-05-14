import { PaginateModel } from "mongoose";
import { TokenDoc } from "@/src/user/schemas/token.schema";

export class TokenService {
  constructor(public model: PaginateModel<TokenDoc>) {}

  async storeKeyToken(userId: string, keyToken: string) {
    const storeKey = await this.model.create({ userId, keyToken });
    return storeKey;
  }

  async deleteToken(userId: string) {
    return await this.model.deleteMany({ userId });
  }
}
