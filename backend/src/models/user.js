import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  location: { type: String, default: 'Not Provided' }, // Legacy field - kept for backward compatibility
  role: { type: String, enum: ["helper", "hirer", "admin"], default: "helper" },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },
  resetOtpVerifiedAt: { type: Date },
  googleId: { type: String },

  // Hirer-specific fields
  bio: { type: String, maxlength: 500 },
  
  // Precise address with coordinates
  address: {
    latitude: { type: Number },
    longitude: { type: Number },
    district: { type: String },
    municipality: { type: String },
    ward: { type: Number },
    street: { type: String }
  },

  // Hirer verification documents
  verificationDocs: {
    citizenshipFront: { type: String }, // URL to uploaded image
    citizenshipBack: { type: String },  // URL to uploaded image
    selfieWithId: { type: String }      // URL to uploaded image
  },

  // Verification fields
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'approved', 'rejected'],
    default: 'unverified'
  },

  // KYC Documents (array of URLs) - kept for helpers
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

  // Stats - calculated from actual data
  totalHires: { type: Number, default: 0 }, // Auto-increments when shift is completed
  
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
