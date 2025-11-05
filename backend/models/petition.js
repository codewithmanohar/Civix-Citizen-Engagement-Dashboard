import mongoose from "mongoose";

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Public Safety", "Environment", "Education", "Healthcare", "Infrastructure", "Transportation","Housing"],
      default: "Other",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    signatures: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        signedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Under Review", "Resolved" , "Rejected"],
      default: "Active",
    },
  },
  { timestamps: true }
);



const PetitionModel = mongoose.model("Petition", petitionSchema);
export default PetitionModel ; 
