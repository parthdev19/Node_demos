import { Router } from "express";
import multer from "multer";

import interestController from "./../../controllers/admin/interest.controller";
import { asyncHandler } from "./../../../utils/common_fun";
import auth from "../../middlewares/auth.admin";

const upload = multer();

export const interestRouter: Router = Router();

interestRouter.post(
  "/add_place_interest",
  upload.single("interest_place_icon"),
  auth as any,
  asyncHandler(interestController.addPlaceInterest.bind(interestController))
);

interestRouter.get(
  "/get_place_interest",
  auth as any,
  asyncHandler(interestController.getPlaceInterests.bind(interestController))
);
