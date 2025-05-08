import mongoose, { Document, Schema } from "mongoose";

interface IUserInterest extends Document {
  interest_user_type: String;
  interest_user_icon: String;
  selected_person: Number;
  is_deleted: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserInterestSchema: Schema = new Schema(
  {
    interest_user_type: { 
        type: String 
    },
    interest_user_icon: { 
        type: String 
    },
    selected_person: { 
        type: Number, 
        default: 0 
    },
    is_deleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUserInterest>("user_interest", UserInterestSchema);