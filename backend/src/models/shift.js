import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema({
  // Basic shift information
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },

  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },

  // What type of work is this? (e.g., Marketing, Construction, etc.)
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: [
      "Construction",
      "Marketing",
      "Delivery",
      "Event Staff",
      "Cleaning",
      "Security",
      "Teaching",
      "Data Entry",
      "Customer Service",
      "Other",
    ],
  },

  // Payment details - storing min and max for range flexibility
  pay: {
    min: {
      type: Number,
      required: [true, "Minimum pay is required"],
      min: [0, "Pay cannot be negative"],
    },
    max: {
      type: Number,
      required: [true, "Maximum pay is required"],
      min: [0, "Pay cannot be negative"],
    },
  },

  // Location stored as coordinates from Leaflet map
  location: {
    // Human-readable address (e.g., "Thamel, Kathmandu")
    address: {
      type: String,
      required: [true, "Location address is required"],
    },
    
    // City name for filtering
    city: {
      type: String,
      required: [true, "City is required"],
    },

    // Exact coordinates from the map
    coordinates: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
  },

  // When does this shift happen?
  date: {
    type: Date,
    required: [true, "Shift date is required"],
  },

  // Shift timing
  time: {
    start: {
      type: String, // Format: "09:00 AM"
      required: [true, "Start time is required"],
    },
    end: {
      type: String, // Format: "05:00 PM"
      required: [true, "End time is required"],
    },
  },

  // What skills are needed for this job?
  skills: {
    type: [String],
    default: [],
  },

  // Who posted this shift? Link to the Hirer's user account
  hirerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Track the shift status
  // open: Available for applications
  // reserved: A worker has been selected but shift hasn't started
  // in-progress: Shift is currently happening
  // completed: Shift is done, ready for mutual reviews
  // cancelled: Shift was cancelled
  status: {
    type: String,
    enum: ["open", "reserved", "in-progress", "completed", "cancelled"],
    default: "open",
  },

  // Keep track of workers who applied
  applicants: [
    {
      workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],

  // The worker who was hired for this shift (set when application is accepted)
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // If a worker is selected/hired (legacy field - kept for backward compatibility)
  selectedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
});

// Add indexes for faster queries
ShiftSchema.index({ hirerId: 1, status: 1 });
ShiftSchema.index({ status: 1, date: 1 });
ShiftSchema.index({ "location.city": 1 });

const Shift = mongoose.model("Shift", ShiftSchema);

export default Shift;
