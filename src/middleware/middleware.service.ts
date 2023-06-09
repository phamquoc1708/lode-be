import { NextFunction, Request, Response } from "express";
import { AppError } from "@/src/utils/error";
import { ValidationError } from "ajv";
import { StatusCodes } from "http-status-codes";

function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (!error) {
    return next();
  }

  if (error instanceof AppError) {
    res.status(error.code).json({ statusCode: error.code, error: error.message });
  } else if (error instanceof ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      error: error,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error,
    });
  }

  return next();
}

function errorNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new AppError(StatusCodes.NOT_FOUND, "Not Found");
  res.status(StatusCodes.NOT_FOUND).json({
    code: StatusCodes.NOT_FOUND,
    error: error.message,
  });
}

export { errorHandler, errorNotFound };
