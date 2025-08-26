import mongoose from "mongoose";

const PetitionSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["active", "closed"], default: "active" },
}, { timestamps: true });


const PetitionModel = mongoose.model("Petition", PetitionSchema);
export default PetitionModel ; 
