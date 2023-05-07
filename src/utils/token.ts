import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError } from "./error";

const generateToken = (payload: object, key: string, expiresIn?: string) => {
  return jwt.sign(payload, key, { expiresIn });
};

const verifyToken = (token: string, secret: string) => {
  try {
    const result = jwt.verify(token, secret);
    return result;
  } catch (error) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Token invalid");
  }
};

const decodeToken = (token: string) => {
  try {
    const result = jwt.decode(token);
    return result;
  } catch (error) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Token invalid");
  }
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
};
