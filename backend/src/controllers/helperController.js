// backend/src/controllers/helperController.js
import HelperProfile from "../models/helperProfile.js";
import Notification from "../models/Notification.js";
import User from "../models/user.js";

/**
 * Get all workers/helpers with their profiles (for hirers to browse)
 * @route GET /api/helper/workers
 * @access Private (hirer only)
 */
export const getAllWorkers = async (req, res) => {
  try {
    // Find all users with role 'helper'
    const helpers = await User.find({ role: 'helper' })
      .select('fullName email phone isVerified verificationStatus')
      .lean();

    // Get profiles for all helpers
    const helperIds = helpers.map(h => h._id);
    const profiles = await HelperProfile.find({ user: { $in: helperIds } }).lean();

    // Map profiles to helpers
    const profileMap = {};
    profiles.forEach(profile => {
      profileMap[profile.user.toString()] = profile;
    });

    // Combine helper data with profiles
    const workersWithProfiles = helpers.map(helper => ({
      ...helper,
      profile: profileMap[helper._id.toString()] || null
    }));

    res.status(200).json({
      success: true,
      count: workersWithProfiles.length,
      data: workersWithProfiles
    });
  } catch (error) {
    console.error("getAllWorkers error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching workers",
      error: error.message
    });
  }
};

/**
 * Get helper profile for current user
 * @route GET /api/helper/profile
 * @access Private (helper only)
 */
export const getHelperProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const profile = await HelperProfile.findOne({ user: userId }).populate('user', 'fullName email phone isVerified verificationStatus');

    if (!profile) {
      return res.status(200).json({
        success: true,
        profileExists: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      profileExists: true,
      data: profile
    });
  } catch (error) {
    console.error("getHelperProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message
    });
  }
};

export const updateHelperProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    console.log("Updating profile for user:", userId);
    console.log("Payload:", req.body);

    const {
      skillCategory,
      yearsOfExperience,
      aboutMe,
      hourlyRate,
      location,
      isAvailable
    } = req.body;

    let profile = await HelperProfile.findOne({ user: userId });

    if (!profile) {
      console.log("Creating new profile for user");
      profile = new HelperProfile({ user: userId });
    }

    // Update fields if provided matches
    if (skillCategory) profile.skillCategory = skillCategory;

    // Handle number fields safely - prevent null/empty string casting errors
    if (yearsOfExperience !== undefined && yearsOfExperience !== null && yearsOfExperience !== "") {
      profile.yearsOfExperience = Number(yearsOfExperience);
    }

    if (aboutMe !== undefined) profile.aboutMe = aboutMe;

    if (hourlyRate !== undefined && hourlyRate !== null && hourlyRate !== "") {
      profile.hourlyRate = Number(hourlyRate);
    }

    if (isAvailable !== undefined) profile.isAvailable = isAvailable;

    // Update location if provided
    if (location) {
      // Safe access to existing location
      const profileObj = (typeof profile.toObject === 'function') ? profile.toObject() : profile;
      const currentLoc = profileObj.location || {};
      const currentCoords = currentLoc.coordinates || {};

      // Determine latitude - Handle null/empty string explicitly
      let newLatitude = location.latitude;
      if (newLatitude === null || newLatitude === "") {
        // If explicitly null in payload, fallback to existing or undefined
        newLatitude = undefined;
      }
      // If still undefined, fallback to current
      if (newLatitude === undefined && location.coordinates?.latitude !== undefined) {
        newLatitude = location.coordinates.latitude;
      }
      if (newLatitude === undefined) {
        newLatitude = currentCoords.latitude;
      }

      // Determine longitude - Handle null/empty string explicitly
      let newLongitude = location.longitude;
      if (newLongitude === null || newLongitude === "") {
        newLongitude = undefined;
      }
      // If still undefined, fallback to current
      if (newLongitude === undefined && location.coordinates?.longitude !== undefined) {
        newLongitude = location.coordinates.longitude;
      }
      if (newLongitude === undefined) {
        newLongitude = currentCoords.longitude;
      }

      // Construct update object
      const locationUpdate = {
        address: location.address || currentLoc.address,
        city: location.city || currentLoc.city,
        coordinates: {
          // Only include if they are valid numbers
          latitude: (newLatitude !== undefined && newLatitude !== null) ? Number(newLatitude) : undefined,
          longitude: (newLongitude !== undefined && newLongitude !== null) ? Number(newLongitude) : undefined
        }
      };

      profile.location = locationUpdate;
    }

    await profile.save();
    console.log("Profile saved successfully");

    // Populate user data before returning
    await profile.populate('user', 'fullName email phone isVerified verificationStatus');

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    console.error("updateHelperProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile: " + error.message,
      error: error.message
    });
  }
};

/**
 * Update helper location with coordinates
 * @route PUT /api/helper/location
 * @access Private (helper only)
 */
export const updateHelperLocation = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { latitude, longitude, address, city } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    let profile = await HelperProfile.findOne({ user: userId });

    if (!profile) {
      profile = new HelperProfile({ user: userId });
    }

    profile.location = {
      address: address || '',
      city: city || '',
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: {
        location: profile.location
      }
    });
  } catch (error) {
    console.error("updateHelperLocation error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating location",
      error: error.message
    });
  }
};

/**
 * Submit citizenship verification documents
 * @route POST /api/helper/verify
 * @access Private (helper only)
 */
export const submitVerification = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { citizenshipNumber, citizenshipFrontImage, citizenshipBackImage } = req.body;

    if (!citizenshipNumber || !citizenshipFrontImage || !citizenshipBackImage) {
      return res.status(400).json({
        success: false,
        message: "Citizenship number and both images are required"
      });
    }

    // Update helper profile with citizenship info
    let profile = await HelperProfile.findOne({ user: userId });

    if (!profile) {
      profile = new HelperProfile({ user: userId });
    }

    profile.citizenshipNumber = citizenshipNumber;
    profile.citizenshipFrontImage = citizenshipFrontImage;
    profile.citizenshipBackImage = citizenshipBackImage;

    // This save will trigger the pre-save hook to recalculate profile completion percentage
    await profile.save();

    // Update user verification status to pending
    await User.findByIdAndUpdate(userId, {
      verificationStatus: 'pending',
      documents: [
        {
          type: 'id',
          url: citizenshipFrontImage,
          status: 'pending'
        },
        {
          type: 'id',
          url: citizenshipBackImage,
          status: 'pending'
        }
      ]
    });

    // Notify Admins
    const admins = await User.find({ role: 'admin' });
    if (admins.length > 0) {
      const adminNotifications = admins.map(admin => ({
        recipient: admin._id,
        type: 'info',
        title: 'New Verification Request',
        message: 'A helper has submitted documents for verification.',
        relatedId: userId
      }));
      await Notification.insertMany(adminNotifications);
    }

    res.status(200).json({
      success: true,
      message: "Verification documents submitted successfully. Your verification is under review.",
      data: {
        verificationStatus: 'pending'
      }
    });
  } catch (error) {
    console.error("submitVerification error:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting verification",
      error: error.message
    });
  }
};

/**
 * Get verification status
 * @route GET /api/helper/verification-status
 * @access Private (helper only)
 */
export const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId).select('isVerified verificationStatus rejectionReason');
    const profile = await HelperProfile.findOne({ user: userId }).select('citizenshipNumber citizenshipFrontImage citizenshipBackImage');

    // Determine actual verification status for frontend
    let status = 'not_submitted';
    if (user?.isVerified) {
      status = 'verified';
    } else if (user?.verificationStatus === 'rejected') {
      status = 'rejected';
    } else if (profile?.citizenshipNumber && profile?.citizenshipFrontImage && profile?.citizenshipBackImage) {
      status = 'pending';
    }

    res.status(200).json({
      success: true,
      data: {
        isVerified: user?.isVerified || false,
        verificationStatus: status,
        status: status,
        rejectionReason: user?.rejectionReason || null,
        hasSubmittedDocuments: !!(profile?.citizenshipNumber && profile?.citizenshipFrontImage && profile?.citizenshipBackImage)
      }
    });
  } catch (error) {
    console.error("getVerificationStatus error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching verification status",
      error: error.message
    });
  }
};

/**
 * Upload image file (for citizenship documents)
 * @route POST /api/helper/upload
 * @access Private (helper only)
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Return the file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: fileUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error("uploadImage error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message
    });
  }
};

/**
 * Check if helper can bid on shifts (must be verified)
 * @route GET /api/helper/can-bid
 * @access Private (helper only)
 */
export const canBidOnShifts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId).select('isVerified verificationStatus');
    const profile = await HelperProfile.findOne({ user: userId }).select('citizenshipNumber');

    const canBid = user?.isVerified === true;

    // Determine verification status for frontend
    let status = 'not_submitted';
    if (user?.verificationStatus === 'approved') {
      status = 'verified';
    } else if (user?.verificationStatus === 'rejected') {
      status = 'rejected';
    } else if (profile?.citizenshipNumber) {
      status = 'pending';
    }

    res.status(200).json({
      success: true,
      data: {
        canBid,
        verificationStatus: status,
        reason: canBid ? null : "You must be verified to bid on shifts. Please complete your verification."
      }
    });
  } catch (error) {
    console.error("canBidOnShifts error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking bid eligibility",
      error: error.message
    });
  }
};
