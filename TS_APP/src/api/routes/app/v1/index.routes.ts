import { Router } from "express";

const router = Router();

import { userRouter } from "./user.routes";

router.use("/api/v1/user", userRouter);

export default router;
