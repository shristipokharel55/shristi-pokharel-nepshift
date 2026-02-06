// backend/src/models/Application.js
import mongoose from "mongoose";

// Define the Application schema
const applicationSchema = new mongoose.Schema(
  {
    // Reference to the worker who applied (connects to User model)
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This links to the User collection
      required: true,
    },

    // Reference to the shift they applied for (connects to Shift model)
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift", // This links to the Shift collection
      required: true,
    },

    // Status of the application (pending, approved, or rejected)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"], // Only these 3 values are allowed
      default: "pending", // When first created, status is "pending"
    },

    // When the worker applied for this shift
    appliedAt: {
      type: Date,
      default: Date.now, // Automatically set to current date/time
    },
  },
  {
    // This adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

// Create and export the Application model
const Application = mongoose.model("Application", applicationSchema);

export default Application;
