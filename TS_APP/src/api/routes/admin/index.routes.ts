import { Router } from "express";

const router = Router();

import { adminRouter } from "./admin.routes";
import { interestRouter } from "./interest.routes";

router.use("/api/admin", adminRouter);
router.use("/api/interest", interestRouter);

export default router;
