import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  user_type: "user" | "admin";
  user_name: string;
  email_address: string;
  user_profile?: string;
  password?: string | null;
  mobile_number?: number | null;
  dob?: Date;
  country?: string;
  user_interest?: [string | null];
  user_place_interest?: [string | null];
  is_allow_push_notification: boolean;
  is_sms_notification: boolean;
  is_email_notification: boolean;
  is_social_login: boolean;
  social_media_id?: string;
  social_media_type?: "google" | "apple";
  notification_badge: number;
  is_live: boolean;
  is_block_by_admin: boolean;
  is_self_deleted: boolean;
  is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

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
    user_profile:{
      type: String,
      default: null
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
    country: {
      type: String,
    },
    user_interest:[
      { 
        type: mongoose.Schema.ObjectId,
        ref: 'user_interests'
      }
    ],
    user_place_interest:[
      { 
        type: mongoose.Schema.ObjectId,
        ref: 'place_interests'
      }
    ],
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
    is_social_login: {
      type: Boolean,
      default: false,
    },
    social_media_id: {
      type: String,
    },
    social_media_type: {
      type: String,
      enum: ["google", "apple"],
    },
    notification_badge: {
      type: Number,
      default: 0,
    },
    is_live: {
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
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IUser>("users", UserSchema);
