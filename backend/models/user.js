import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 150 },
  password: { type: String, required: true },
  role: { type: String, enum: ["citizen", "official"], required: true },
  location: { type: String, required: true },
  verificationStatus: { type: String, enum: ["unverified", "pending", "verified"], default: "unverified" },
  idDocumentType: String,       // optional
  idDocumentNumber: String,     // optional (encrypted or hashed)
  idDocumentUrl: String ,         // if user uploads file
  otp: { type: String },// 6-digit code 
  otpExpires: { type: Date}, // expiry timestamp
}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);

export default UserModel ; 