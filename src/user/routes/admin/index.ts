import express from "express";

import { AdminService } from "@/src/user/services/admin.service";
import { AdminController } from "@/src/user/controllers/admin/admin.controller";
import { ValidationService } from "@/src/helper/validation.service";
import { asyncHandler } from "@/src/utils/handler";
import { UserModel } from "../../schemas/user.schema";
import { BankService } from "../../services/bank.service";
import { BankWithdrawModel } from "../../schemas/bankWithdraw.schema";
import { BankModel } from "../../schemas/bank.schema";
import { BankDepositModel } from "../../schemas/bankDeposit.schema";
import { checkAuthAdmin } from "@/src/middleware/auth.middleware";

const router = express.Router();

const bankService = new BankService(BankModel, BankWithdrawModel, BankDepositModel);
const adminService = new AdminService(UserModel, bankService);
const validation = new ValidationService();
const adminController = new AdminController(adminService, validation);

router.get("/list-bank-waiting", checkAuthAdmin, asyncHandler(adminController.getListBankWaiting()));
router.get("/list-bank-done", checkAuthAdmin, asyncHandler(adminController.getListBankDone()));
router.post("/accept-deposit", checkAuthAdmin, asyncHandler(adminController.acceptDeposit()));
router.post("/reject-deposit", checkAuthAdmin, asyncHandler(adminController.rejectDeposit()));

export default router;
