// backend/src/routes/applicationRoutes.js
import express from "express";
import {
    createApplication,
    getShiftApplicants,
    getWorkerApplications,
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

export default router;
