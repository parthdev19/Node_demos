import { Request, Response } from "express";
import i18n from "i18n";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import place_interest from "./../../models/place_interest.model";
import user_interest from "./../../models/user_interest.model";

import { successRes, errorRes } from "./../../../utils/response_formate";

interface placeInterestRequestBody {
  interest_place_type?: string;
  interest_place_icon?: string;
  ln?: string;
}

interface userInterestRequestBody {
  interest_user_type?: string;
  interest_user_icon?: string;
  ln?: string;
}

class InterestController {
  public async addPlaceInterest(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { interest_place_type, ln = "en" }: placeInterestRequestBody =
        req.body;

      i18n.setLocale(req, ln);

      const files = req.file as Express.Multer.File;

      const file_extension = path.extname(files.originalname);

      const place_interest_icon = `${uuidv4()}${file_extension}`;

      const savePath = path.join(
        __dirname,
        "./../../../public/places_interest_icon",
        place_interest_icon
      );

      const dir = path.dirname(savePath);

      await fs.promises.writeFile(savePath, files.buffer);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const findInterestPlace = await place_interest.findOne({
        interest_place_type: interest_place_type,
        is_deleted: false,
      });

      if (findInterestPlace) {
        return errorRes(res, res.__("This place type already exists"));
      }

      let insertData: any = {
        interest_place_type,
      };

      insertData.interest_place_icon = `places_interest_icon/${place_interest_icon}`;

      const createPlaceInterest: any = await place_interest.create(insertData);

      const resData : object = {
        _id: createPlaceInterest._id,
        interest_place_type: createPlaceInterest.interest_place_type,
        interest_place_icon: process.env.ADMIN_BASE_URL + createPlaceInterest.interest_place_icon,
        createdAt: createPlaceInterest.createdAt,
        selected_person: createPlaceInterest.selected_person
      }

      if (createPlaceInterest) {
        return successRes(
          res,
          res.__("Place type added successfully"),
          resData
        );
      } else {
        return errorRes(res, res.__("Failed to add place type"));
      }
    } catch (error) {
      console.error("Error in admin interest:", error);
      return errorRes(res, i18n.__("Internal server error"));
    }
  }

  public async getPlaceInterests(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {

      const interests = await place_interest.aggregate([
        { $match: { is_deleted: false } },
        {
          $addFields: {
            interest_place_icon: {
              $concat: [process.env.ADMIN_BASE_URL,"$interest_place_icon"],
            },
          },
        },
      ]);

      return successRes(
        res,
        res.__("Place interests fetched successfully"),
        interests
      );
      
    } catch (error) {
      console.error("Error in getPlaceInterests:", error);
      return errorRes(res, i18n.__("Internal server error"));
    }
  }

  public async updatePlaceInterest(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const { interest_place_type, ln = "en" }: placeInterestRequestBody =
        req.body;

      i18n.setLocale(req, ln);

      const file = req.file as Express.Multer.File | undefined;
      let updatedData: any = { interest_place_type };

      if (file) {
        const file_extension = path.extname(file.originalname);
        const place_interest_icon = `${uuidv4()}${file_extension}`;
        const savePath = path.join(
          __dirname,
          "./../../../public/places_interest_icon",
          place_interest_icon
        );

        if (!fs.existsSync(path.dirname(savePath))) {
          fs.mkdirSync(path.dirname(savePath), { recursive: true });
        }

        await fs.promises.writeFile(savePath, file.buffer);
        updatedData.interest_place_icon = `place_interest_icon/${place_interest_icon}`;
      }

      const updatedInterest = await place_interest.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );

      if (!updatedInterest) {
        return errorRes(res, res.__("Place interest not found"));
      }

      return successRes(
        res,
        res.__("Place interest updated successfully"),
        updatedInterest
      );
    } catch (error) {
      console.error("Error in updatePlaceInterest:", error);
      return errorRes(res, i18n.__("Internal server error"));
    }
  }

  public async deletePlaceInterest(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;

      const deletedInterest = await place_interest.findByIdAndUpdate(
        id,
        { is_deleted: true },
        { new: true }
      );

      if (!deletedInterest) {
        return errorRes(res, res.__("Place interest not found"));
      }

      return successRes(
        res,
        res.__("Place interest deleted successfully"),
        deletedInterest
      );
    } catch (error) {
      console.error("Error in deletePlaceInterest:", error);
      return errorRes(res, i18n.__("Internal server error"));
    }
  }
}

export default new InterestController();
