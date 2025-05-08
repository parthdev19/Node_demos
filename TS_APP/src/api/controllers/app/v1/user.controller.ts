import { Request, Response } from "express";
import i18n from "i18n";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import { successRes, errorRes } from "../../../../utils/response_formate";
import { userToken } from "./../../../../utils/token";
import { encryptPassword } from "./../../../../utils/common_fun";

import MailTemplates from "./../../../../emails/mail.template";
const mailService = new MailTemplates();

import users from "./../../../models/user.model";
import user_session from "./../../../models/user_session.model";
import email_verify from "./../../../models/email_verify.model";

interface UserRequestBody {
  user_type?: string;
  user_name?: string;
  user_profile?: string;
  user_interest?: any;
  user_place_interest?: any;
  password?: string;
  session_id?: string;
  dob?: Date;
  country?: string;
  email_address?: string;
  mobile_number?: number;
  is_email_notification?: boolean;
  is_allow_push_notification?: boolean;
  is_social_login?: boolean;
  social_media_id?: string;
  social_media_type?: string;
  ln?: string;
}

class UserController {
  public async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const {
        user_type,
        user_name,
        user_interest,
        password,
        user_place_interest,
        dob,
        country,
        email_address,
        mobile_number,
        is_social_login,
        social_media_id,
        social_media_type,
        ln = "en",
      }: UserRequestBody = req.body;

      i18n.setLocale(req, ln);

      const userInterestArr = await JSON.parse(user_interest);

      const userPlaceInterestArr = await JSON.parse(user_place_interest);

      const files = req.file as Express.Multer.File;

      const findEmail = await users.findOne({
        email_address,
        is_deleted: false,
      });

      if (findEmail) {
        return errorRes(res, res.__("This email address already exists"));
      }

      const findUserName = await users.findOne({
        user_name,
        is_deleted: false,
      });

      if (findUserName) {
        return errorRes(res, res.__("This user name already exists"));
      }

      let insertData: any = {
        user_type,
        user_name,
        dob,
        country,
        mobile_number,
        email_address,
      };

      if (password) {
        const hashPassword = await encryptPassword(password);
        insertData.password = hashPassword;
      }

      if (files) {
        const file_extension = path.extname(files.originalname);

        const user_profile = `${uuidv4()}${file_extension}`;

        const savePath = path.join(
          __dirname,
          "./../../../../public/user_profile",
          user_profile
        );

        // Ensure the directory exists
        const dir = path.dirname(savePath);

        await fs.promises.writeFile(savePath, files.buffer);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        insertData.user_profile = `user_profile/${user_profile}`;
      }

      insertData.user_interest = userInterestArr;
      insertData.user_place_interest = userPlaceInterestArr;

      if (is_social_login === true) {
        insertData.is_social_login = is_social_login;
        insertData.social_media_id = social_media_id;
        insertData.social_media_type = social_media_type;
      }

      const createUser: any = await users.create(insertData);

      const emailVerifyData: object = {
        email_address: createUser.email_address,
      };

      const generateVerifyLink: any = await email_verify.create(
        emailVerifyData
      );

      const token = await userToken(createUser);

      const emailData: any = {
        email_address: createUser.email_address,
        user_name: createUser.user_name,
        token: token,
        verify_link_id: generateVerifyLink._id
      };

      await mailService.verifyEmail(emailData);

      // const session = await user_session.create({
      //   user_id: createUser._id,
      //   user_type,
      //   auth_token: token,
      // });

      const user_profile = process.env.APP_BASE_URL + createUser.user_profile;

      delete createUser.user_profile;

      const userWithSession = {
        ...createUser._doc,
        token,
        // device_token: session.device_token,
        // device_type: session.device_type,
        user_profile: user_profile,
        // session_id: session._id,
      };

      return successRes(
        res,
        res.__("User signed up successfully"),
        userWithSession
      );
    } catch (error) {
      console.error("Error from the signUp function:", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }

  public async signIn(req: Request, res: Response): Promise<Response> {
    try {
      const {
        email_address,
        password,
        session_id,
        ln = "en",
      }: UserRequestBody = req.body;

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
          const token = await userToken(user._id);

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
              user_profile: process.env.APP_BASE_URL + user.user_profile,
            };

            return successRes(
              res,
              i18n.__("User signin successfully"),
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
              user_profile: process.env.APP_BASE_URL + user.user_profile,
            };

            return successRes(
              res,
              i18n.__("User signin successfully"),
              resData
            );
          }
        } else {
          return errorRes(res, i18n.__("Invalid email and password"));
        }
      }

      return errorRes(res, i18n.__("Invalid email and password"));
    } catch (error) {
      console.error("Error from the signUp function:", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }
}

export default new UserController();
