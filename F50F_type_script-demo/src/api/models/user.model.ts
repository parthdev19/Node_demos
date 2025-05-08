import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  user_type: "user" | "admin";
  user_name: string;
  email_address: string;
  password?: string | null;
  mobile_number?: number | null;
  dob?: Date;
  invite_code?: string;
  country?: string;
  is_allow_push_notification: boolean;
  is_sms_notification: boolean;
  is_email_notification: boolean;
  back_camera: boolean;
  flip_only_preferred_set_stakes: boolean;
  background_music: boolean;
  game_languages: "english" | "french" | "dutch" | "spanish";
  user_clip?: mongoose.Types.ObjectId;
  app_pin?: string;
  is_use_manual_pin?: boolean;
  is_social_login: boolean;
  social_media_id?: string;
  social_media_type?: "facebook" | "google" | "apple";
  stakes: number;
  is_invite_by_refer: boolean;
  referral_user_id?: mongoose.Types.ObjectId;
  wallet_balance: number;
  is_pin_flip: boolean;
  is_self_exclusion: boolean;
  self_exclusion_time?: "50_hours" | "25_days" | "all_time" | null;
  is_all_time_self_exclusion: boolean;
  start_self_exclusion?: Date | null;
  end_self_exclusion?: Date | null;
  noti_badge: number;
  is_live: boolean;
  is_login: boolean;
  is_block_by_admin: boolean;
  is_self_deleted: boolean;
  app_open_count: number;
  app_last_open_time?: Date | null;
  is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema corresponding to the document interface.
const UserSchema: Schema<IUser> = new Schema(
  {
    user_type: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: [true, "User type is required."],
    },
    user_name: {
      type: String,
      required: [true, "Username is required."],
    },
    email_address: {
      type: String,
      required: [true, "Email is required."],
    },
    password: {
      type: String,
      default: null,
    },
    mobile_number: {
      type: Number,
      default: null,
    },
    dob: {
      type: Date,
    },
    invite_code: {
      type: String,
    },
    country: {
      type: String,
    },
    is_allow_push_notification: {
      type: Boolean,
      default: false,
    },
    is_sms_notification: {
      type: Boolean,
      default: true,
    },
    is_email_notification: {
      type: Boolean,
      default: true,
    },
    back_camera: {
      type: Boolean,
      default: true,
    },
    flip_only_preferred_set_stakes: {
      type: Boolean,
      default: false,
    },
    background_music: {
      type: Boolean,
      default: true,
    },
    game_languages: {
      type: String,
      enum: ["english", "french", "dutch", "spanish"],
      default: "english",
    },
    user_clip: {
      type: Schema.Types.ObjectId,
      ref: "clip",
      default: null,
    },
    app_pin: {
      type: String,
      default: "50505050",
    },
    is_use_manual_pin: {
      type: Boolean,
    },
    is_social_login: {
      type: Boolean,
      default: false,
    },
    social_media_id: {
      type: String,
    },
    social_media_type: {
      type: String,
      enum: ["facebook", "google", "apple"],
    },
    stakes: {
      type: Number,
      default: 5,
    },
    is_invite_by_refer: {
      type: Boolean,
      default: false,
    },
    referral_user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    wallet_balance: {
      type: Number,
      default: 50,
    },
    is_pin_flip: {
      type: Boolean,
      default: false,
    },
    is_self_exclusion: {
      type: Boolean,
      default: false,
    },
    self_exclusion_time: {
      type: String,
      enum: ["50_hours", "25_days", "all_time"],
      default: null,
    },
    is_all_time_self_exclusion: {
      type: Boolean,
      default: false,
    },
    start_self_exclusion: {
      type: Date,
      default: null,
    },
    end_self_exclusion: {
      type: Date,
      default: null,
    },
    noti_badge: {
      type: Number,
      default: 0,
    },
    is_live: {
      type: Boolean,
      default: false,
    },
    is_login: {
      type: Boolean,
      default: false,
    },
    is_block_by_admin: {
      type: Boolean,
      default: false,
    },
    is_self_deleted: {
      type: Boolean,
      default: false,
    },
    app_open_count: {
      type: Number,
      default: 0,
    },
    app_last_open_time: {
      type: Date,
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IUser>("users", UserSchema);
