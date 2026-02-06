// backend/src/controllers/reviewController.js
import HelperProfile from "../models/helperProfile.js";
import Review from "../models/Review.js";
import Shift from "../models/shift.js";
import User from "../models/user.js";

/**
 * Submit a review for a completed shift
 * Automatically recalculates the average rating for the person being reviewed
 * @route POST /api/reviews
 * @access Private (Both Hirer and Worker can review each other)
 */
export const submitReview = async (req, res) => {
  try {
    const { shiftId, toUserId, rating, comment } = req.body;
    const fromUserId = req.user._id || req.user.id;

    // Step 1: Validate required fields
    if (!shiftId || !toUserId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please provide shiftId, toUserId, and rating"
      });
    }

    // Step 2: Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Step 3: Check if shift exists and is completed
    const shift = await Shift.findById(shiftId);
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found"
      });
    }

    if (shift.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: "You can only review completed shifts"
      });
    }

    // Step 4: Verify the user is authorized to review
    // Hirer can only review the worker, Worker can only review the hirer
    const isHirer = shift.hirerId.toString() === fromUserId.toString();
    const isWorker = shift.worker && shift.worker.toString() === fromUserId.toString();

    if (!isHirer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to review this shift"
      });
    }

    // Step 5: Ensure the review is going to the right person
    if (isHirer && shift.worker.toString() !== toUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Hirer can only review the worker who completed the shift"
      });
    }

    if (isWorker && shift.hirerId.toString() !== toUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Worker can only review the hirer who posted the shift"
      });
    }

    // Step 6: Check if review already exists
    const existingReview = await Review.findOne({
      shiftId,
      fromUser: fromUserId,
      toUser: toUserId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this shift"
      });
    }

    // Step 7: Create the review
    const review = await Review.create({
      shiftId,
      fromUser: fromUserId,
      toUser: toUserId,
      rating,
      comment: comment || ""
    });

    // Step 8: Recalculate average rating for the person being reviewed
    // Student Logic: (Total Points + Current Rating) / (Total Reviews + 1)
    
    // Get the user being reviewed
    const toUser = await User.findById(toUserId);
    
    // Calculate new average rating
    // Formula: (Previous Total Points + New Rating) / (Previous Total Reviews + 1)
    const newRatingSum = (toUser.ratingSum || 0) + rating;
    const newTotalRatings = (toUser.totalRatings || 0) + 1;
    const newAverageRating = newRatingSum / newTotalRatings;

    // Update the User model
    toUser.ratingSum = newRatingSum;
    toUser.totalRatings = newTotalRatings;
    toUser.rating = parseFloat(newAverageRating.toFixed(2)); // Round to 2 decimal places
    await toUser.save();

    // Step 9: If the person being reviewed is a worker, also update HelperProfile
    if (toUser.role === 'helper') {
      const helperProfile = await HelperProfile.findOne({ user: toUserId });
      if (helperProfile) {
        helperProfile.averageRating = parseFloat(newAverageRating.toFixed(2));
        await helperProfile.save();
      }
    }

    // Step 10: Send success response
    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: {
        review,
        updatedRating: {
          averageRating: parseFloat(newAverageRating.toFixed(2)),
          totalRatings: newTotalRatings
        }
      }
    });

  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message
    });
  }
};

/**
 * Get reviews for a specific user
 * @route GET /api/reviews/user/:userId
 * @access Public
 */
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all reviews where this user is the recipient
    const reviews = await Review.find({ toUser: userId })
      .populate('fromUser', 'fullName role')
      .populate('shiftId', 'title date')
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
};

/**
 * Check if user can review a shift
 * @route GET /api/reviews/can-review/:shiftId
 * @access Private
 */
export const canReviewShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const userId = req.user._id || req.user.id;

    // Check if shift exists and is completed
    const shift = await Shift.findById(shiftId);
    if (!shift || shift.status !== 'completed') {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "Shift not completed"
      });
    }

    // Check if user is part of this shift
    const isHirer = shift.hirerId.toString() === userId.toString();
    const isWorker = shift.worker && shift.worker.toString() === userId.toString();

    if (!isHirer && !isWorker) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "Not part of this shift"
      });
    }

    // Determine who the user should review
    const toUserId = isHirer ? shift.worker : shift.hirerId;

    // Check if review already exists
    const existingReview = await Review.findOne({
      shiftId,
      fromUser: userId,
      toUser: toUserId
    });

    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "Already reviewed"
      });
    }

    // User can review
    res.status(200).json({
      success: true,
      canReview: true,
      toUserId
    });

  } catch (error) {
    console.error("Error checking review eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check review eligibility",
      error: error.message
    });
  }
};
