import express from "express";

import { AdminService } from "@/src/user/services/admin.service";
import { AdminController } from "@/src/user/controllers/admin/admin.controller";
import { ValidationService } from "@/src/helper/validation.service";
import { asyncHandler } from "@/src/utils/handler";

const router = express.Router();

const adminService = new AdminService();
const validation = new ValidationService();
const adminController = new AdminController(adminService, validation);

router.use("/", asyncHandler(adminController.login()));

export default router;
