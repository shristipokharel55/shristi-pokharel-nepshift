import mongoose from "mongoose";

// This model stores all the bids workers place on shifts
const BidSchema = new mongoose.Schema({
  // Which shift is this bid for?
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
    required: true,
  },

  // Which worker is placing this bid?
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Who posted this shift? (so we can notify them)
  hirerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // How much is the worker asking for?
  bidAmount: {
    type: Number,
    required: [true, "Please enter your rate"],
    min: [0, "Rate cannot be negative"],
  },

  // When can the worker start?
  estimatedArrivalTime: {
    type: String,
    required: [true, "Please specify when you can start"],
  },

  // Personal message from worker to hirer
  message: {
    type: String,
    maxlength: [500, "Message cannot exceed 500 characters"],
  },

  // Track the status of this bid
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
}, {
  timestamps: true, // Auto-add createdAt and updatedAt
});

// Make sure the same worker can't bid twice on the same shift
BidSchema.index({ shiftId: 1, workerId: 1 }, { unique: true });

const Bid = mongoose.model("Bid", BidSchema);

export default Bid;
