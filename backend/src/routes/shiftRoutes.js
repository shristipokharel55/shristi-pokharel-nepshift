import express from "express";
import {
    completeShift,
    createShift,
    deleteShift,
    getAllApplicants,
    getAllOpenShifts,
    getAllShifts,
    getMyShifts,
    getShiftById,
    getShiftDetails,
    updateShift,
} from "../controllers/shiftController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route - anyone can view all open shifts
router.get("/", getAllShifts);

// Protected routes - need to be logged in
// Get my posted shifts (for hirers) - MUST come BEFORE /:id to avoid route conflict
router.get("/my-shifts", protect, authorizeRoles("hirer"), getMyShifts);

// Get all applicants across my shifts (for hirers)
router.get("/applicants", protect, authorizeRoles("hirer"), getAllApplicants);

// Get all OPEN shifts (for workers to browse) - MUST come BEFORE /:id
router.get("/open", getAllOpenShifts);

// Get shift details WITH bids (for hirers) - MUST come BEFORE /:id
router.get("/:id/details", protect, authorizeRoles("hirer"), getShiftDetails);

// Complete a shift and update stats (for hirers and assigned workers) - MUST come BEFORE /:id
router.put("/:shiftId/complete", protect, completeShift);

// Only hirers can post shifts
router.post("/", protect, authorizeRoles("hirer"), createShift);

// Get a single shift by ID - MUST come AFTER specific routes
router.get("/:id", getShiftById);

// Update and delete - only the hirer who posted it
router.put("/:id", protect, authorizeRoles("hirer"), updateShift);
router.delete("/:id", protect, authorizeRoles("hirer"), deleteShift);

export default router;
