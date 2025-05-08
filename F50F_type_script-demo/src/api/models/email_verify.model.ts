import mongoose, { Schema, Document } from "mongoose";

interface IEmailVerify extends Document {
  email_address: string;
  otp: number | null;
  is_email_verified: boolean;
  is_deleted: boolean;
}


const emailVerifySchema: Schema<IEmailVerify> = new Schema(
  {
    email_address: {
      type: String,
      required: [true, "Email is required."],
    },
    otp: {
      type: Number,
      default: null,
    },
    is_email_verified: {
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


const EmailVerify = mongoose.model<IEmailVerify>("email_verify", emailVerifySchema);
export default EmailVerify;
