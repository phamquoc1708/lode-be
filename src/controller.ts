import { NextFunction, Request, Response } from "express";
import { ConsumerRequest } from "@/src/middleware/auth.middleware";

export type HandleFunc = (req: ConsumerRequest, res: Response, next: NextFunction) => Promise<void> | void;
export type HandleFuncError = (error: Error, req: Request, res: Response, next: NextFunction) => Promise<void> | void;
