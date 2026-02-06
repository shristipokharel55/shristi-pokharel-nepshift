// backend/src/routes/reviewRoutes.js
import express from "express";
import {
    canReviewShift,
    getUserReviews,
    submitReview
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Submit a review (Both Hirer and Worker can review each other)
router.post("/", protect, submitReview);

// Get all reviews for a specific user
router.get("/user/:userId", getUserReviews);

// Check if the logged-in user can review a specific shift
router.get("/can-review/:shiftId", protect, canReviewShift);

export default router;
