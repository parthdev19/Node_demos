import { Request, Response } from "express";
import i18n from "i18n";

import { successRes, errorRes } from "../../../../utils/response_formate";

import users from "../../../models/user.model";
import leaderboard from "../../../models/leaderboard.model";
import user_session from "../../../models/user_session.model";
import wallet_history from "../../../models/wallet_history.model";
import email_verify from "../../../models/email_verify.model";
import fip_group from "../../../models/fip_group.model";

import { userToken } from "./../../../../utils/token";
import { generateInviteCode } from "./../../../../utils/common_fun";
import {
  sendOtpCode,
  verifyEmail
} from "./../../../../emails/email.template";

interface UserRequestBody {
  user_type?: string;
  user_name?: string;
  dob?: Date;
  invite_code?: string;
  country?: string;
  email_address?: string;
  mobile_number?: number;
  app_pin?: number;
  user_clip?: number;
  is_email_notification?: boolean;
  is_allow_push_notification?: boolean;
  is_social_login?: boolean;
  social_media_id?: string;
  social_media_type?: string;
  is_invite_by_refer?: boolean;
  device_token?: string;
  device_type?: string;
  referral_invite_code?: string;
  ln?: string;
}

class UserController {
  public async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const {
        user_type,
        user_name,
        dob,
        invite_code,
        country,
        email_address,
        mobile_number,
        app_pin,
        user_clip,
        is_email_notification,
        is_allow_push_notification,
        is_social_login,
        social_media_id,
        social_media_type,
        is_invite_by_refer,
        device_token,
        device_type,
        referral_invite_code,
        ln = "en",
      }: UserRequestBody = req.body;

      i18n.setLocale(req, ln);

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
        invite_code,
        country,
        mobile_number,
        email_address,
        is_email_notification,
        is_allow_push_notification,
        app_pin,
      };

      if (is_social_login === true) {
        insertData.is_social_login = is_social_login;
        insertData.social_media_id = social_media_id;
        insertData.social_media_type = social_media_type;

        const emailData = {
          email_address,
          is_email_verified: true,
        };

        await email_verify.create(emailData);
      }

      let referUserId;

      if (is_invite_by_refer === true) {
        insertData.is_invite_by_refer = is_invite_by_refer;

        const findReferralUserId = await users.findOne({
          invite_code: referral_invite_code,
          is_verify: true,
          is_deleted: false,
        });

        if (findReferralUserId) {
          await users.findByIdAndUpdate(
            findReferralUserId._id,
            {
              $inc: { wallet_balance: 50 },
            },
            { new: true }
          );

          await leaderboard.updateOne(
            { user_id: findReferralUserId._id },
            { $inc: { total_points: 50 } }
          );

          referUserId = findReferralUserId._id;

          const walletHistoryData = {
            to_user_id: referUserId,
            points: 50,
            point_type: "referral_bonus",
          };
          await wallet_history.create(walletHistoryData);
        }

        insertData.wallet_balance = 50;
        insertData.referral_user_id = referUserId;

        const signupBonusHistory = {
          to_user_id: referUserId,
          points: 50,
          point_type: "signup_bonus",
        };
        await wallet_history.create(signupBonusHistory);
      }

      const createUser: any = await users.create(insertData);

      if (createUser) {
        await leaderboard.create({ user_id: createUser?._id });
        await fip_group.create({ user_id: createUser?._id });

        await wallet_history.create({
          to_user_id: createUser._id,
          points: 50,
          point_type: "signup_bonus",
        });
      }

      const token = await userToken(createUser);

      const session = await user_session.create({
        user_id: createUser._id,
        user_type,
        device_token,
        auth_token: token,
        device_type,
      });

      const userWithSession = {
        ...createUser._doc,
        token,
        device_token: session.device_token,
        device_type: session.device_type,
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

  public async createInviteCode(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      let { ln = "en" } = req.body;
      i18n.setLocale(req, ln);

      let isUnique = false;
      let invite_code;

      while (!isUnique) {
        invite_code = await generateInviteCode();

        const check_invite_code = await users.find({
          invite_code: invite_code,
        });

        if (check_invite_code.length === 0) {
          isUnique = true;
        }
      }

      return successRes(
        res,
        res.__("Invite code is generated successfully"),
        invite_code
      );
    } catch (error) {
      console.error("Error from the createInviteCode function:", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }

  public async checkUserInviteCode(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { invite_code, ln } = req.body;
      i18n.setLocale(req, ln);

      const find_invite_code = await users.findOne({
        invite_code: invite_code,
        is_verify: true,
        is_deleted: false,
      });

      if (!find_invite_code) {
        return errorRes(res, res.__("Invalid invite code"));
      } else {
        return successRes(
          res,
          res.__("Invite code is valid"),
          find_invite_code.invite_code
        );
      }
    } catch (error) {
      console.error("Error from the createInviteCode function:", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }

  public async verifyUserAppPin(
    req: {
      user: { _id: string };
      body: { user_id: string; app_pin: string; ln: string };
    },
    res: Response
  ): Promise<Response> {
    try {

      const user_id: any = req.body.user_id || req.user._id;

      const { app_pin, ln } = req.body;
      i18n.setLocale(req, ln);

      const user = await users.findOne({ _id: user_id, app_pin: app_pin });

      if (user) {
        return successRes(
          res,
          res.__("Pin verified successfully"),
          user.app_pin
        );
      } else {
        return errorRes(res, res.__("Invalid app pin"));
      }
    } catch (error) {
      console.error("Error from the createInviteCode function:", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }

  public async sendOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email_address, ln } = req.body;
      i18n.setLocale(req, ln);

      const find_user = await email_verify.findOne({
        email_address: email_address,
        is_deleted: false,
      });

      if (!find_user) {
        return errorRes(res, res.__("No account was found with this email address"));
      }

      const otp = Math.floor(100000 + Math.random() * 800000);

      console.log({ otp });

      const data: any = {
        otp,
        emailAddress: email_address,
      };

      sendOtpCode(data);

      const update_data = {
        otp,
      };

      await email_verify.findByIdAndUpdate(find_user._id, update_data);
      await users.findByIdAndUpdate(find_user._id, update_data);

      return successRes(
        res,
        res.__("Your forgot password code was sent successfully to your email"),
        otp
      );
    } catch (error) {
      console.error("Error:", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }

  public async sendOTPForEmailVerify(req: Request, res: Response): Promise<Response> {
    try {
      const { email_address, ln } = req.body;
      i18n.setLocale(req, ln);

      const user_data = await email_verify.findOne({
        email_address,
        is_deleted: false,
      });

      const otp = Math.floor(100000 + Math.random() * 800000);

      if (user_data) {
        const data: any = {
          otp,
          emailAddress: email_address,
        };

        verifyEmail(data);

        const update_data = {
          otp,
        };

        await email_verify.findByIdAndUpdate(user_data._id, update_data);
      } else {
        const insert_data = {
          email_address,
        };

        const create_user = await email_verify.create(insert_data);

        const data: any = {
          otp,
          emailAddress: email_address,
        };

        verifyEmail(data);

        const update_data = {
          otp,
        };

        await email_verify.findByIdAndUpdate(create_user._id, update_data);
      }

      return successRes(
        res,
        res.__("Your verification code was sent successfully to your email"),
        otp
      );
    } catch (error) {
      console.error("Error:", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }

  public async verifyOtp(req: Request, res: Response): Promise<Response> {
    try {
      let { email_address, otp, ln } = req.body;
      i18n.setLocale(req, ln);

      let find_user = await email_verify.findOne({
        email_address: email_address,
        is_deleted: false,
      });

      var find_user_id = await users.findOne({
        email_address: email_address,
        is_deleted: false,
      });

      if (!find_user) {
        return errorRes(
          res,
          res.__("No account was found with this email address")
        );
      }

      if (find_user.otp == otp) {
        let update_data = {
          otp: null,
          is_email_verified: true,
        };

        await email_verify.findByIdAndUpdate(find_user._id, update_data, {
          new: true,
        });

        return successRes(res, res.__("OTP verified successfully"), find_user_id);

      } else {
        return errorRes(res, res.__("Please enter valid OTP"));
      }


    } catch (error) {
      console.log("Error : ", error);
      return errorRes(res, res.__("Internal server error"));
    }
  }

  // public async setClip(req: UserRequestBody, res: Response): Promise<Response> {
  //   try {
  //     const { clip_id, ln } = req.body;
  //     i18n.setLocale(req, ln);

  //     let user_id;

  //     if (req.user._id) {
  //       user_id = req.user._id;
  //     } else {
  //       user_id = req.body.user_id;
  //     }

  //     const find_clip = await clips.findOne({
  //       _id: clip_id,
  //       // user_id: user_id,
  //       is_block_by_admin: false,
  //       is_deleted: false,
  //     });

  //     if (!find_clip) {
  //       return errorRes(res, res.__("Clip not found"));
  //     }

  //     const set_clip = await users.findByIdAndUpdate(
  //       {
  //         _id: user_id,
  //         is_deleted: false,
  //       },
  //       {
  //         $set: {
  //           user_clip: clip_id,
  //         },
  //       }
  //     );

  //     if (set_clip) {
  //       return successRes(res, res.__("Clip set successfully"));
  //     }
  //   } catch (error) {
  //     console.log("Error : ", error);
  //     return errorRes(res, res.__("Internal server error"));
  //   }
  // }
}

export default new UserController();
