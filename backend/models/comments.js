import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    petition: { type: mongoose.Schema.Types.ObjectId, ref: "Petition", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel;
