import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  location: { type: String, required: true },
  role: { type: String, enum: ["helper", "hirer", "admin"], default: "helper" },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },
  resetOtpVerifiedAt: { type: Date },
  googleId: { type: String },

  isVerified: { type: Boolean, default: false },
});

export default mongoose.model("User", UserSchema);
