import express from "express";
import UserRoute from "@/src/user/routes";

const router = express.Router();

router.use("/users", UserRoute);

export default router;
