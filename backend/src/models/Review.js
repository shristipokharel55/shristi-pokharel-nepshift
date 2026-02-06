// backend/src/models/Review.js
import mongoose from "mongoose";

/**
 * Review Model - Stores ratings and comments after shift completion
 * Supports mutual rating: Hirer can rate Worker, Worker can rate Hirer
 */
const ReviewSchema = new mongoose.Schema({
  // Which shift is this review for?
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true
  },

  // Who is giving the review?
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Who is receiving the review?
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },

  // Optional comment/feedback
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per user per shift
// A hirer can only review a worker once for a specific shift and vice versa
ReviewSchema.index({ shiftId: 1, fromUser: 1, toUser: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
