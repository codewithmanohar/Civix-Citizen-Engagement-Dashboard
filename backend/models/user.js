import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 150 },
  password: { type: String, required: true },
  role: { type: String, enum: ["citizen", "official"], required: true },
  location: { type: String, required: true },
  verificationStatus: { type: String, enum: ["unverified", "verified"], default: "unverified" },
}, { timestamps: true });


const UserModel = mongoose.model("User", UserSchema);

export default UserModel ; 