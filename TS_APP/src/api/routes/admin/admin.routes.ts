import { Router } from "express";
import multer from "multer";

import adminController from "./../../controllers/admin/admin.controller";
import { asyncHandler } from "./../../../utils/common_fun";
import auth from "../../middlewares/auth.admin";

export const upload = multer();

export const adminRouter: Router = Router();

adminRouter.post(
  "/sign_up",
  upload.single("user_profile"),
  asyncHandler(adminController.signUp.bind(adminController))
);

adminRouter.post(
  "/sign_in",
  upload.none(),
  asyncHandler(adminController.signIn.bind(adminController))
);
