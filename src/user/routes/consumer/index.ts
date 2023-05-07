import { TokenService } from "./../../services/token.service";
import express from "express";

import { UserModel } from "./../../schemas/user.schema";
import { TokenModel } from "./../../schemas/token.schema";
import { UserService } from "@/src/user/services/user.service";
import { ConsumerController } from "@/src/user/controllers";
import { ValidationService } from "@/src/helper/validation.service";
import { asyncHandler } from "@/src/utils/handler";
import { checkAuthConsumer } from "@/src/middleware/auth.middleware";

const router = express.Router();

const tokenService = new TokenService(TokenModel);
const adminService = new UserService(UserModel, tokenService);
const validation = new ValidationService();
const consumerController = new ConsumerController(adminService, validation);

router.post("/register", asyncHandler(consumerController.register()));
router.post("/login", asyncHandler(consumerController.login()));
router.get("/test", checkAuthConsumer, asyncHandler(consumerController.register()));

export default router;
