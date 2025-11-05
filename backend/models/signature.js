import mongoose from "mongoose";

const SignatureSchema = new mongoose.Schema(
  {
    petitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Petition", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },   // New field
    comment: { type: String },                // Optional field
  },
  { timestamps: true }
);

// Prevent duplicate signing
SignatureSchema.index({ petitionId: 1, userId: 1 }, { unique: true });

const SignatureModel = mongoose.model("Signature", SignatureSchema);

export default SignatureModel;
