import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  location: { type: String },
  role: { type: String, enum: ['worker','employer','admin'], default: 'worker' },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  // profile fields for worker/employer
  skills: [String],
  rating: { type: Number, default: 0 },
  // for wallet/payments
  balance: { type: Number, default: 0 }
});

export default mongoose.model('User', UserSchema);
