import express from "express";

import routesAdmin from "@/src/user/routes/admin";
import routesConsumer from "@/src/user/routes/consumer";

const router = express.Router();

router.use("/admin", routesAdmin);
router.use("/consumer", routesConsumer);

export default router;
