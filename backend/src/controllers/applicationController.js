// backend/src/controllers/applicationController.js
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import User from "../models/user.js";

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

    // Step 3: Get shift details and worker details for notification
    const Shift = (await import("../models/shift.js")).default;
    const shift = await Shift.findById(shiftId);
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found",
      });
    }

    const worker = await User.findById(workerId);

    // Step 4: Create the new application
    const newApplication = await Application.create({
      worker: workerId,
      shift: shiftId,
      status: "pending", // Default status
    });

    // Step 5: Create notification for the Hirer
    // The notification is linked to the hirer's User ID (shift.hirerId)
    // This way, when the hirer logs in, they can see all notifications for them
    await Notification.create({
      recipient: shift.hirerId, // Send notification to the shift owner (hirer)
      type: "info",
      title: "New Application Received",
      message: `${worker.fullName} has applied for your shift "${shift.title}"`,
      relatedId: newApplication._id, // Link to the application for reference
    });

    // Step 6: Return the created application
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
 * Enhanced with Notifications and Availability Tracking
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

    // Step 7: Create notification for the Worker
    // The notification is linked to the worker's User ID (application.worker._id)
    // When the worker logs in, they can see this notification in their inbox
    const notificationMessage =
      status === "approved"
        ? `Congratulations! Your application for "${application.shift.title}" has been approved.`
        : `Your application for "${application.shift.title}" has been rejected.`;

    const notificationType = status === "approved" ? "success" : "info";

    await Notification.create({
      recipient: application.worker._id, // Send notification to the worker
      type: notificationType,
      title:
        status === "approved"
          ? "Application Approved"
          : "Application Rejected",
      message: notificationMessage,
      relatedId: application._id, // Link to the application
    });

    // Step 8: Availability Logic - Mark worker as booked if approved
    if (status === "approved") {
      // Find the worker and update their booking status
      const worker = await User.findById(application.worker._id);

      // Initialize bookedDates array if it doesn't exist
      if (!worker.bookedDates) {
        worker.bookedDates = [];
      }

      // Add this shift's date to worker's booked dates
      // This prevents double-booking on the same date
      const shiftDate = new Date(application.shift.date).toISOString().split("T")[0];
      
      // Check if date is not already in bookedDates array
      if (!worker.bookedDates.some(date => date.toISOString().split("T")[0] === shiftDate)) {
        worker.bookedDates.push(new Date(application.shift.date));
        await worker.save();
      }
    }

    // Step 9: Send success response
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

/**
 * Alias for updateApplicationStatus - Respond to an application (Accept/Reject)
 * This is the same function with a more descriptive name as requested
 * @route PUT /api/applications/:applicationId/respond
 * @access Private (Hirer only)
 */
export const respondToApplication = updateApplicationStatus;
