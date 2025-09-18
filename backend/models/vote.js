import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    selectedOption: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate votes (1 user per poll)
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);
