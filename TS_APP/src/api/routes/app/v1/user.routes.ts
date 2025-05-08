import { Router } from "express";
import multer from "multer";

import userController from "./../../../controllers/app/v1/user.controller";
import { asyncHandler } from "./../../../../utils/common_fun";
import auth from "../../../middlewares/auth.user";

const upload = multer();

export const userRouter: Router = Router();

userRouter.post(
  "/sign_up",
  upload.single("user_profile"),
  asyncHandler(userController.signUp.bind(userController))
);

userRouter.post(
  "/sign_in",
  upload.none(),
  asyncHandler(userController.signIn.bind(userController))
);
