// backend/src/controllers/userController.js
import HelperProfile from "../models/helperProfile.js";
import User from "../models/user.js";

/**
 * Get Public Worker Profile (For Hirers to view)
 * @route GET /api/users/worker/:id
 * @access Public (Anyone can view worker profiles)
 */
export const getPublicWorkerProfile = async (req, res) => {
  try {
    // Step 1: Get the worker ID from URL parameter
    const { id } = req.params;

    // Step 2: Find the user (worker) by ID
    // Select only the fields that are safe to show publicly
    const user = await User.findById(id).select(
      "fullName email phone profilePhoto isVerified role createdAt rating totalRatings"
    );

    // Step 3: Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Step 4: Check if the user is actually a worker/helper
    if (user.role !== "helper") {
      return res.status(400).json({
        success: false,
        message: "This user is not a worker",
      });
    }

    // Step 5: Find the worker's detailed profile
    const helperProfile = await HelperProfile.findOne({ user: id });

    // Step 6: Check if worker has any upcoming approved applications (booked dates)
    const Application = (await import("../models/Application.js")).default;
    const currentDate = new Date();
    
    // Find approved applications for future shifts
    const approvedApplications = await Application.find({
      worker: id,
      status: "approved",
    }).populate("shift", "date");

    // Check if worker is booked for any upcoming shifts
    const hasUpcomingBooking = approvedApplications.some((app) => {
      if (!app.shift || !app.shift.date) return false;
      return new Date(app.shift.date) > currentDate;
    });

    // Step 7: Prepare the response data
    const profileData = {
      // Basic Info from User model
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profilePhoto: user.profilePhoto || null,
      isVerified: user.isVerified,
      rating: user.rating || 0,
      totalRatings: user.totalRatings || 0,
      memberSince: user.createdAt,

      // Detailed Info from HelperProfile model
      skillCategory: helperProfile?.skillCategory || "General Worker",
      yearsOfExperience: helperProfile?.yearsOfExperience || 0,
      aboutMe: helperProfile?.aboutMe || "No description provided yet.",
      hourlyRate: helperProfile?.hourlyRate || 0,
      location: {
        address: helperProfile?.location?.address || "Not specified",
        city: helperProfile?.location?.city || "Not specified",
      },
      averageRating: helperProfile?.averageRating || 0,
      totalJobsCompleted: helperProfile?.totalJobsCompleted || 0,
      isAvailable: helperProfile?.isAvailable || true,
      
      // Booking status - if worker has upcoming approved shifts
      hasUpcomingBooking: hasUpcomingBooking,
      bookedDates: user.bookedDates || [],
    };

    // Step 8: Send the profile data back
    res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Error fetching public worker profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch worker profile",
      error: error.message,
    });
  }
};
