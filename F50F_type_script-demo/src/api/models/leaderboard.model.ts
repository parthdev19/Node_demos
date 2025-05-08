import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the document
interface ILeaderboard extends Document {
  user_id: mongoose.Types.ObjectId;
  total_points: number;
  total_win_points: number;
  total_loss_points: number;
  total_flip: number;
  total_win_game: number;
  total_loss_game: number;
  is_deleted: boolean;
}

// Create the schema
const leaderboardSchema: Schema<ILeaderboard> = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    total_points: {
      type: Number,
      default: 50,
    },
    total_win_points: {
      type: Number,
      default: 0,
    },
    total_loss_points: {
      type: Number,
      default: 0,
    },
    total_flip: {
      type: Number,
      default: 0,
    },
    total_win_game: {
      type: Number,
      default: 0,
    },
    total_loss_game: {
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

// Create and export the model
const Leaderboard = mongoose.model<ILeaderboard>("leaderboards", leaderboardSchema);
export default Leaderboard;
