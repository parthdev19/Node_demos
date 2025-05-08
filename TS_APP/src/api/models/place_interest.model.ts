import mongoose, { Document, Schema } from "mongoose";

interface IPlaceInterest extends Document {
  interest_place_type: String;
  interest_place_icon: String;
  selected_person: Number;
  is_deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PlaceInterestSchema: Schema<IPlaceInterest> = new Schema(
  {
    interest_place_type: {
      type: String,
    },
    interest_place_icon: {
      type: String,
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
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IPlaceInterest>("place_interest", PlaceInterestSchema);
