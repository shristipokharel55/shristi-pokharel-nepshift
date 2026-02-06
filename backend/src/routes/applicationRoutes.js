// backend/src/routes/applicationRoutes.js
import express from "express";
import {
    createApplication,
    getShiftApplicants,
    getWorkerApplications,
    respondToApplication,
    updateApplicationStatus,
} from "../controllers/applicationController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication (user must be logged in)
router.use(protect);

// Get all applications for the logged-in worker
// Only workers/helpers can access this route
router.get(
  "/my-applications",
  authorizeRoles("helper"), // Only helpers/workers allowed
  getWorkerApplications
);

// Create a new application (apply for a shift)
// Only workers/helpers can apply
router.post(
  "/apply",
  authorizeRoles("helper"), // Only helpers/workers allowed
  createApplication
);

// Get all applicants for a specific shift (For Hirers)
// Only hirers can access this route
router.get(
  "/shift/:shiftId",
  authorizeRoles("hirer"), // Only hirers allowed
  getShiftApplicants
);

// Update application status (Accept/Reject)
// Only hirers can update application status
router.put(
  "/:applicationId/status",
  authorizeRoles("hirer"), // Only hirers allowed
  updateApplicationStatus
);

// Alternative route - Respond to application (same as status update)
// This is an alias for better API naming
// router.put(
//   "/:applicationId/respond",
//   authorizeRoles("hirer"), // Only hirers allowed
//   respondToApplication
// );

router.patch('/:id/respond', protect, respondToApplication);

/*
 * HOW WORKER AVAILABILITY IS CHECKED:
 * 
 * 1. When a worker's application is APPROVED, the shift date is added to their `bookedDates` array in the User model
 * 2. To check if a worker is available on a specific date:
 *    - Query: User.findById(workerId).select('bookedDates')
 *    - Check if the target date exists in the bookedDates array
 *    - If it exists → Worker is UNAVAILABLE (already booked for that day)
 *    - If it doesn't exist → Worker is AVAILABLE
 * 
 * 3. Example usage in your frontend or other controllers:
 *    const worker = await User.findById(workerId);
 *    const targetDate = new Date('2024-12-25').toISOString().split('T')[0];
 *    const isBooked = worker.bookedDates.some(date => 
 *      date.toISOString().split('T')[0] === targetDate
 *    );
 *    const availability = isBooked ? 'Unavailable' : 'Available';
 * 
 * 4. For displaying availability on worker profiles:
 *    - Check if worker has any approved applications with future dates
 *    - Query: Application.find({ worker: workerId, status: 'approved' }).populate('shift')
 *    - Filter shifts with date >= today
 *    - If any found → Show as "Unavailable" or "Booked"
 */

export default router;
