import mongoose, { Schema, Document } from "mongoose";

interface IWalletHistory extends Document {
  game_id: mongoose.Types.ObjectId;
  from_user_id?: mongoose.Types.ObjectId;
  to_user_id: mongoose.Types.ObjectId;
  points: number;
  point_type?: "signup_bonus" | "won_event" | "head" | "tail" | "auto_flip" | "referral_bonus";
  is_deleted: boolean;
}

const walletHistorySchema: Schema<IWalletHistory> = new Schema(
  {
    game_id: {
      type: Schema.Types.ObjectId,
      ref: "games",
    },
    from_user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    to_user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    point_type: {
      type: String,
      enum: ["signup_bonus", "won_event", "head", "tail", "auto_flip", "referral_bonus"],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const WalletHistory = mongoose.model<IWalletHistory>("wallet_history", walletHistorySchema);
export default WalletHistory;
