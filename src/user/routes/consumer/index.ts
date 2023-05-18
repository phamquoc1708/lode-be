import { BankDepositModel } from "./../../schemas/bankDeposit.schema";
import express from "express";

import { BankWithdrawModel } from "./../../schemas/bankWithdraw.schema";
import { BankService } from "./../../services/bank.service";
import { TokenService } from "./../../services/token.service";
import { UserModel } from "./../../schemas/user.schema";
import { TokenModel } from "./../../schemas/token.schema";
import { BankModel } from "./../../schemas/bank.schema";
import { UserService } from "@/src/user/services/user.service";
import { ConsumerController } from "@/src/user/controllers";
import { ValidationService } from "@/src/helper/validation.service";
import { asyncHandler } from "@/src/utils/handler";
import { checkAuthConsumer, checkAuthAdmin } from "@/src/middleware/auth.middleware";

const router = express.Router();

const tokenService = new TokenService(TokenModel);
const bankService = new BankService(BankModel, BankWithdrawModel, BankDepositModel);
const consumerService = new UserService(UserModel, tokenService, bankService);
const validation = new ValidationService();
const consumerController = new ConsumerController(consumerService, validation);

router.post("/register", asyncHandler(consumerController.register()));
router.post("/login", asyncHandler(consumerController.login()));
router.post("/logout", checkAuthConsumer, asyncHandler(consumerController.logout()));
router.get("/me", checkAuthConsumer, asyncHandler(consumerController.getMyProfile()));
router.put("/me", checkAuthConsumer, asyncHandler(consumerController.updateProfile()));
router.get("/bank", checkAuthConsumer, asyncHandler(consumerController.getBankExist()));
router.post("/bank-account", checkAuthConsumer, asyncHandler(consumerController.createBankAccount()));
router.get("/bank-account", checkAuthConsumer, asyncHandler(consumerController.getBankAccount()));
router.get("/bank-withdraw", checkAuthConsumer, asyncHandler(consumerController.getBankWithdraw()));
router.post("/bank-withdraw", checkAuthConsumer, asyncHandler(consumerController.createBankWithdraw()));
router.get("/bank-deposit", checkAuthConsumer, asyncHandler(consumerController.getBankDeposit()));
router.post("/bet", checkAuthConsumer, asyncHandler(consumerController.betGame()));
router.get("/bet", checkAuthConsumer, asyncHandler(consumerController.getHistoryGame()));
router.post("/money", checkAuthConsumer, asyncHandler(consumerController.addMoney()));
router.get("/money", checkAuthConsumer, asyncHandler(consumerController.getHistoryMoney()));
router.get("/test", checkAuthConsumer, asyncHandler(consumerController.register()));

export default router;
