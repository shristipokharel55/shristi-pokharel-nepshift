// backend/src/models/helperProfile.js
import mongoose from "mongoose";

const HelperProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Profile Information
  skillCategory: {
    type: String,
    enum: ['Plumber', 'Electrician', 'Cleaning', 'Gardening', 'General Labour', 'Cooking', 'Delivery', 'Painting', 'Carpentry', 'Other'],
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  aboutMe: {
    type: String,
    maxLength: 500
  },
  hourlyRate: {
    type: Number
  },

  // Location with coordinates
  location: {
    address: { type: String },
    city: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },

  // Profile completion tracking
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  profileCompletionPercentage: {
    type: Number,
    default: 0
  },

  // Citizenship/Identity Verification
  citizenshipNumber: {
    type: String
  },
  citizenshipFrontImage: {
    type: String  // URL to uploaded image
  },
  citizenshipBackImage: {
    type: String  // URL to uploaded image
  },

  // Ratings and stats
  averageRating: {
    type: Number,
    default: 0
  },
  totalJobsCompleted: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },

  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate profile completion percentage before saving
HelperProfileSchema.pre('save', function (next) {
  let percentage = 0;

  // Basic Profile Fields (Warning: Weighted to total 80%)
  // 1. Skill Category (16%)
  if (this.skillCategory) percentage += 16;

  // 2. Years of Experience (16%)
  if (this.yearsOfExperience !== undefined && this.yearsOfExperience !== null) percentage += 16;

  // 3. About Me (16%)
  if (this.aboutMe) percentage += 16;

  // 4. Hourly Rate (16%)
  if (this.hourlyRate) percentage += 16;

  // 5. Location (Coordinates) (16%)
  // Use map coordinates as primary location indicator
  if (this.location?.coordinates?.latitude && this.location?.coordinates?.longitude) percentage += 16;

  // Verification Fields (Weighted to total remaining 20%)
  // Citizenship Number (7%) + Front (7%) + Back (6%) = 20%
  if (this.citizenshipNumber) percentage += 7;
  if (this.citizenshipFrontImage) percentage += 7;
  if (this.citizenshipBackImage) percentage += 6;

  this.profileCompletionPercentage = Math.min(Math.round(percentage), 100);
  this.isProfileComplete = this.profileCompletionPercentage >= 80;
  this.updatedAt = new Date();

  next();
});

export default mongoose.model("HelperProfile", HelperProfileSchema);
