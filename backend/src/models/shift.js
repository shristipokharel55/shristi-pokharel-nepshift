import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  
  // Hirer who posted the shift
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Worker assigned to the shift (null if not yet assigned)
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  
  // Shift location
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // Shift timing
  shiftDate: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "17:00"
  duration: { type: Number }, // in hours
  
  // Payment
  payRate: { type: Number, required: true }, // per hour in NPR
  totalPay: { type: Number },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  
  // Shift status
  status: { 
    type: String, 
    enum: ['open', 'active', 'in_progress', 'completed', 'cancelled'], 
    default: 'open' 
  },
  
  // Category/Type of work
  category: { 
    type: String, 
    enum: ['kitchen', 'cleaning', 'waiter', 'delivery', 'security', 'event', 'other'],
    required: true
  },
  
  // Requirements
  requirements: [{ type: String }],
  skillsRequired: [{ type: String }],
  
  // Applicants
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  
  // Ratings (after completion)
  workerRating: { type: Number, min: 1, max: 5 },
  hirerRating: { type: Number, min: 1, max: 5 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Update the updatedAt field before saving
ShiftSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate total pay based on duration and pay rate
ShiftSchema.pre('save', function(next) {
  if (this.duration && this.payRate) {
    this.totalPay = this.duration * this.payRate;
  }
  next();
});

export default mongoose.model("Shift", ShiftSchema);
