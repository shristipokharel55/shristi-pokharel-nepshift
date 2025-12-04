import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },

  role: {
    type: String,
    enum: ["helper", "hirer", "admin"],
    required: true,
  },

  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },

  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
