import { Router } from "express";
import multer from "multer";

import userController from "./../../../controllers/app/v1/user.controller";
import { asyncHandler } from "./../../../../utils/common_fun";
import auth from "./../../../middlewares/auth";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const userRouter: Router = Router();

userRouter.post(
  "/sign_up",
  upload.none(),
  asyncHandler(userController.signUp.bind(userController))
);

userRouter.post(
  "/generate_invite_code",
  upload.none(),
  asyncHandler(userController.createInviteCode.bind(userController))
);

userRouter.post(
  "/check_invite_code",
  upload.none(),
  asyncHandler(userController.checkUserInviteCode.bind(userController))
);

userRouter.post(
  "/verify_user_app_pin",
  upload.none(),
  auth as any,
  asyncHandler(userController.verifyUserAppPin.bind(userController))
);

userRouter.post(
  "/send_otp",
  upload.none(),
  asyncHandler(userController.sendOTP.bind(userController))
);

userRouter.post(
  "/send_otp_verify_email",
  upload.none(),
  asyncHandler(userController.sendOTPForEmailVerify.bind(userController))
);

userRouter.post(
  "/verify_otp",
  upload.none(),
  asyncHandler(userController.verifyOtp.bind(userController))
);