import mongoose, { Document, Schema } from "mongoose";

interface IEmailVerify extends Document {
  email_address: string;
  is_email_verified: boolean;
  is_deleted: boolean;
}

const emailVerifySchema: Schema<IEmailVerify> = new Schema(
  {
    email_address: {
      type: String,
      required: [true, "Email is required."],
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

export default mongoose.model<IEmailVerify>("email_verify", emailVerifySchema);
