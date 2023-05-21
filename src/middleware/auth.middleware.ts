import { TokenModel } from "./../user/schemas/token.schema";
import { ROLE_CONSUMER, UserModel } from "./../user/schemas/user.schema";
import tokenUtil from "@/src/utils/token";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const HEADER = {
  AUTHORIZATION: "authorization",
};

export interface ConsumerRequest extends Request {
  user?: any;
}

export const checkAuthConsumer: RequestHandler = async (req: ConsumerRequest, res: Response, next: NextFunction) => {
  const token = req.headers[HEADER.AUTHORIZATION] as string;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
  const user = tokenUtil.decodeToken(token) as { userId: string; username: string };
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 1);

  await TokenModel.deleteMany({ expires: { $lt: expiredDate } });
  const data = await TokenModel.findOne({ userId: new mongoose.Types.ObjectId(user.userId) });
  if (!data) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
  try {
    const userReq = tokenUtil.verifyToken(token, data.keyToken);
    req.user = userReq;
    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
};

export const checkAuthAdmin: RequestHandler = async (req: ConsumerRequest, res: Response, next: NextFunction) => {
  const token = req.headers[HEADER.AUTHORIZATION] as string;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
  const user = tokenUtil.decodeToken(token) as { userId: string; username: string };
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
  const isAdmin = await UserModel.findOne({ role: ROLE_CONSUMER.ADMIN, _id: user.userId });
  if (!isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 1);

  await TokenModel.deleteMany({ expires: { $lt: expiredDate } });
  const data = await TokenModel.findOne({ userId: new mongoose.Types.ObjectId(user.userId) });
  if (!data) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
  try {
    const userReq = tokenUtil.verifyToken(token, data.keyToken);
    req.user = userReq;
    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ statusCode: 401, data: "Forbidden Error" });
  }
};
