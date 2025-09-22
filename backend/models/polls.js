import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    options: [
      {
        optionText: { type: String, required: true },
        votes: { type: Number, default: 0 }, // For quick count tracking
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetLocation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
