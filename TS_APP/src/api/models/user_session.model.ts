import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the document
interface IUserSession extends Document {
  user_id: mongoose.Types.ObjectId;
  user_type: "user" | "admin";
  device_token: string;
  auth_token?: string;
  ln: "en" | "fr" | "de" | "es";
  device_type: "ios" | "android" | "web";
  socket_id?: string | null;
  is_login: boolean;
  is_background_music: boolean;
  is_active: boolean;
  is_deleted: boolean;
}

// Create the schema
const userSessionSchema: Schema<IUserSession> = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    user_type: {
      type: String,
      enum: ["user", "admin"],
      required: [true, "User type is required."],
      default: "user"
    },
    device_token: {
      type: String,
      default: null
    },
    auth_token: {
      type: String,
    },
    ln: {
      type: String,
      enum: ["en", "fr", "de", "es"],
      default: "en",
    },
    device_type: {
      type: String,
      enum: ["ios", "android", "web"],
      default: null
    },
    socket_id: {
      type: String,
      default: null,
    },
    is_login: {
      type: Boolean,
      default: true,
    },
    is_active: {
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

// Create and export the model
const UserSession = mongoose.model<IUserSession>("user_sessions", userSessionSchema);
export default UserSession;
