import { Request, Response } from "express";
import i18n from "i18n";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import { successRes, errorRes } from "./../../../utils/response_formate";
import { adminToken } from "./../../../utils/token";

import users from "./../../models/user.model";
import user_session from "./../../models/user_session.model";

import { encryptPassword } from "./../../../utils/common_fun";

interface adminRequestBody {
  user_type?: string;
  user_name?: string;
  user_profile?: string;
  password?: string;
  session_id?: string;
  dob?: Date;
  country?: string;
  email_address?: string;
  mobile_number?: number;
  ln?: string;
}

class adminController {
  public async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const {
        user_type,
        user_name,
        password,
        dob,
        country,
        email_address,
        mobile_number,
        ln = "en",
      }: adminRequestBody = req.body;

      i18n.setLocale(req, ln);

      const files = req.file as Express.Multer.File;

      const findEmail = await users.findOne({
        email_address: email_address,
        is_deleted: false,
      });

      if (findEmail) {
        return errorRes(res, res.__("This email address already exists"));
      }

      let insertData: any = {
        user_type,
        user_name,
        dob,
        country,
        mobile_number,
        email_address,
      };

      if(files){

        const file_extension = path.extname(files.originalname);
  
        const user_profile = `${uuidv4()}${file_extension}`;
  
        const savePath = path.join(
          __dirname,
          "./../../../public/user_profile",
          user_profile
        );
  
        const dir = path.dirname(savePath);
  
        await fs.promises.writeFile(savePath, files.buffer);
  
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        insertData.user_profile = `user_profile/${user_profile}`;
      }


      if (password) {
        const hashPassword = await encryptPassword(password);
        insertData.password = hashPassword;
      }

      const createUser: any = await users.create(insertData);

      const user_profile = process.env.ADMIN_BASE_URL + createUser.user_profile;

      delete createUser.user_profile;

      const token = await adminToken(createUser);

      const session = await user_session.create({
        user_id: createUser._id,
        user_type,
        auth_token: token,
      });

      const userWithSession = {
        ...createUser._doc,
        token,
        user_profile: user_profile,
        session_id: session._id,
        device_type: session.device_type,
      };

      return successRes(
        res,
        res.__("Admin signed up successfully"),
        userWithSession
      );
    } catch (error) {
      console.error("Error in admin signup:", error);
      return errorRes(res, i18n.__("Internal server error"));
    }
  }

  public async signIn(req: Request, res: Response): Promise<Response> {
    try {
      const {
        email_address,
        password,
        session_id,
        ln = "en",
      }: adminRequestBody = req.body;

      i18n.setLocale(req, ln);

      const user: any = await users.findOne({ email_address: email_address });

      if (!user) {
        return errorRes(res, i18n.__("Invalid email and password"));
      }

      if (password) {
        const isMatch: boolean = await bcrypt.compare(
          password,
          user.password as string
        );

        if (isMatch) {
          const token = await adminToken(user._id);

          if (session_id) {
            const session = await user_session.findByIdAndUpdate(
              {
                _id: session_id,
                user_id: user._id,
              },
              {
                $set: {
                  auth_token: token,
                  is_login: true,
                },
              }
            );

            const resData: object = {
              user_id: user._id,
              auth_token: token,
              session_id: session?._id,
              is_login: true,
              user_profile: process.env.ADMIN_BASE_URL + user.user_profile
            };

            return successRes(
              res,
              i18n.__("Admin signin successfully"),
              resData
            );
          } else {
            const session = await user_session.create({
              user_id: user._id,
              auth_token: token,
              is_login: true,
            });

            const resData: object = {
              user_id: user._id,
              auth_token: token,
              session_id: session?._id,
              is_login: true,
              user_profile: process.env.ADMIN_BASE_URL + user.user_profile
            };

            return successRes(
              res,
              i18n.__("Admin signin successfully"),
              resData
            );
          }
        } else {
          return errorRes(res, i18n.__("Invalid email and password"));
        }
      }

      return errorRes(res, i18n.__("Invalid email and password"));
    } catch (error) {
      console.error("Error in admin signin:", error);
      return errorRes(res, i18n.__("Internal server error"));
    }
  }
}

export default new adminController();
