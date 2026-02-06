// backend/src/controllers/applicationController.js
import Application from "../models/Application.js";

/**
 * Get all applications for the logged-in worker
 * @route GET /api/applications/my-applications
 * @access Private (Worker only)
 */
export const getWorkerApplications = async (req, res) => {
  try {
    // Step 1: Get the worker's ID from the logged-in user
    const workerId = req.user._id || req.user.id;

    // Step 2: Find all applications where worker matches the logged-in user
    // .populate('shift') brings in the full shift details instead of just the ID
    const applications = await Application.find({ worker: workerId })
      .populate("shift", "title shiftDate location hourlyRate") // Get shift details
      .sort({ appliedAt: -1 }); // Sort by most recent first

    // Step 3: Send the applications back to the frontend
    res.status(200).json({
      success: true,
      count: applications.length, // Number of applications found
      data: applications,
    });
  } catch (error) {
    // If something goes wrong, send an error response
    console.error("Error fetching worker applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

/**
 * Create a new application (Worker applies for a shift)
 * @route POST /api/applications/apply
 * @access Private (Worker only)
 */
export const createApplication = async (req, res) => {
  try {
    // Step 1: Get worker ID and shift ID
    const workerId = req.user._id || req.user.id;
    const { shiftId } = req.body;

    // Step 2: Check if worker already applied for this shift
    const existingApplication = await Application.findOne({
      worker: workerId,
      shift: shiftId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this shift",
      });
    }

    // Step 3: Create the new application
    const newApplication = await Application.create({
      worker: workerId,
      shift: shiftId,
      status: "pending", // Default status
    });

    // Step 4: Return the created application
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: newApplication,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

/**
 * Get all applicants for a specific shift (For Hirer)
 * @route GET /api/applications/shift/:shiftId
 * @access Private (Hirer only - shift owner)
 */
export const getShiftApplicants = async (req, res) => {
  try {
    // Step 1: Get the shift ID from URL parameter
    const { shiftId } = req.params;
    const hirerId = req.user._id || req.user.id;

    // Step 2: Find the shift to verify ownership
    const Shift = (await import("../models/shift.js")).default;
    const shift = await Shift.findById(shiftId);

    // Step 3: Check if shift exists
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    // Step 4: Security check - only shift owner can see applicants
    if (shift.hirerId.toString() !== hirerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these applicants",
      });
    }

    // Step 5: Find all applications for this shift
    // .populate('worker') brings in the worker's full profile details
    const applications = await Application.find({ shift: shiftId })
      .populate("worker", "fullName email phone role profilePicture") // Get worker details
      .sort({ appliedAt: -1 }); // Most recent first

    // Step 6: Send the applicants back to frontend
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching shift applicants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};

/**
 * Update application status (Accept or Reject)
 * @route PUT /api/applications/:applicationId/status
 * @access Private (Hirer only - shift owner)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    // Step 1: Get application ID and new status
    const { applicationId } = req.params;
    const { status } = req.body; // Should be 'approved' or 'rejected'
    const hirerId = req.user._id || req.user.id;

    // Step 2: Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved' or 'rejected'",
      });
    }

    // Step 3: Find the application and populate shift details
    const application = await Application.findById(applicationId).populate(
      "shift"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Step 4: Security check - only shift owner can update status
    if (application.shift.hirerId.toString() !== hirerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application",
      });
    }

    // Step 5: Update the application status
    application.status = status;
    await application.save();

    // Step 6: Populate worker details for response
    await application.populate("worker", "fullName email");

    // Step 7: Send success response
    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};
