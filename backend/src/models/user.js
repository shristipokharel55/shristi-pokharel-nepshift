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

  // Verification fields
  isVerified: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // KYC Documents (array of URLs)
  documents: [{
    type: { type: String, enum: ['kyc', 'id', 'address', 'business_license'], required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  
  // Verification metadata
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
    
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
