import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the FIP Group document
interface IFipGroup extends Document {
  user_id: mongoose.Types.ObjectId;
  total_member: number;
  is_deleted: boolean;
}

// Create the FIP Group schema
const fipGroupSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    total_member: {
      type: Number,
      default: 0,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// Export the model with the appropriate type
const FipGroup = mongoose.model<IFipGroup>("fip_group", fipGroupSchema);

export default FipGroup;
