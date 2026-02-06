import Bid from "../models/bid.js";
import HelperProfile from "../models/helperProfile.js";
import Shift from "../models/shift.js";
import User from "../models/user.js";
import { HttpError } from "../utils/httpError.js";

export const createShift = async (req, res, next) => {
  try {
    const { title, description, category, pay, location, date, time, skills } = req.body;

    // Validate pay range
    if (pay.min > pay.max) {
      return res.status(400).json({
        success: false,
        message: "Minimum pay cannot be greater than maximum pay"
      });
    }

    // Create shift
    const shift = await Shift.create({
      title,
      description,
      category,
      pay,
      location,
      date,
      time,
      skills: skills || [],
      hirerId: req.user.id,
      status: "open",
    });

    res.status(201).json({
      success: true,
      message: "Shift posted successfully",
      data: shift,
    });
  } catch (error) {
    console.error("Create shift error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create shift"
    });
  }
};

/**
 * @desc    Get all open shifts (for workers to browse)
 * @route   GET /api/shifts
 * @access  Public (or Private for logged-in workers)
 */
export const getAllShifts = async (req, res, next) => {
  try {
    // Extract query parameters for filtering
    const { category, city, minPay, maxPay, date, status = "open" } = req.query;

    // Build the filter object dynamically
    let filter = { status };

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter["location.city"] = city;
    }

    // Filter by pay range if provided
    if (minPay || maxPay) {
      filter["pay.min"] = {};
      if (minPay) filter["pay.min"].$gte = Number(minPay);
      if (maxPay) filter["pay.max"].$lte = Number(maxPay);
    }

    // Filter by date if provided
    if (date) {
      // Get shifts for the specific date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Get shifts and populate the hirer's information
    const shifts = await Shift.find(filter)
      .populate("hirerId", "fullName email phone") // Get hirer details
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get shifts posted by the logged-in hirer
 * @route   GET /api/shifts/my-shifts
 * @access  Private (Hirer only)
 */
export const getMyShifts = async (req, res, next) => {
  try {
    // Get the logged-in hirer's ID from the JWT token
    const hirerId = req.user.id;

    // Optional: filter by status from query params
    const { status } = req.query;
    let filter = { hirerId };

    if (status) {
      filter.status = status;
    }

    // Find all shifts posted by this hirer
    const shifts = await Shift.find(filter)
      .populate("applicants.workerId", "fullName email phone") // Get applicant details
      .populate("selectedWorker", "fullName email phone") // Get selected worker details
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single shift by ID
 * @route   GET /api/shifts/:id
 * @access  Public (or Private)
 */
export const getShiftById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shift = await Shift.findById(id)
      .populate("hirerId", "fullName email phone")
      .populate("applicants.workerId", "fullName email phone")
      .populate("selectedWorker", "fullName email phone");

    if (!shift) {
      throw new HttpError(404, "Shift not found");
    }

    res.status(200).json({
      success: true,
      data: shift,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a shift
 * @route   PUT /api/shifts/:id
 * @access  Private (Hirer only - can only update their own shifts)
 */
export const updateShift = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hirerId = req.user.id;

    // Find the shift
    const shift = await Shift.findById(id);

    if (!shift) {
      throw new HttpError(404, "Shift not found");
    }

    // Make sure the person updating is the one who posted it
    if (shift.hirerId.toString() !== hirerId) {
      throw new HttpError(403, "You can only update your own shifts");
    }

    // Update the shift with new data
    const updatedShift = await Shift.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Shift updated successfully",
      data: updatedShift,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a shift
 * @route   DELETE /api/shifts/:id
 * @access  Private (Hirer only - can only delete their own shifts)
 */
export const deleteShift = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hirerId = req.user.id;

    // Find the shift
    const shift = await Shift.findById(id);

    if (!shift) {
      throw new HttpError(404, "Shift not found");
    }

    // Make sure the person deleting is the one who posted it
    if (shift.hirerId.toString() !== hirerId) {
      throw new HttpError(403, "You can only delete your own shifts");
    }

    await Shift.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applicants across all my shifts
 * @route   GET /api/shifts/applicants
 * @access  Private (Hirer only)
 */
export const getAllApplicants = async (req, res, next) => {
  try {
    const hirerId = req.user.id;

    // Find all shifts posted by this hirer that have applicants
    const shifts = await Shift.find({
      hirerId,
      'applicants.0': { $exists: true } // Only shifts with at least one applicant
    })
      .populate({
        path: 'applicants.workerId',
        select: 'fullName email phone profileImage'
      })
      .select('title category date applicants status');

    // Flatten the applicants array and add shift details
    const allApplicants = [];

    shifts.forEach(shift => {
      shift.applicants.forEach(applicant => {
        if (applicant.workerId) {
          allApplicants.push({
            applicantId: applicant._id,
            shift: {
              id: shift._id,
              title: shift.title,
              category: shift.category,
              date: shift.date,
              status: shift.status
            },
            worker: {
              id: applicant.workerId._id,
              name: applicant.workerId.fullName,
              email: applicant.workerId.email,
              phone: applicant.workerId.phone,
              avatar: applicant.workerId.profileImage
            },
            appliedAt: applicant.appliedAt,
            status: applicant.status
          });
        }
      });
    });

    // Sort by application date (newest first)
    allApplicants.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.status(200).json({
      success: true,
      count: allApplicants.length,
      data: allApplicants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all OPEN shifts (simplified for workers)
 * @route   GET /api/shifts/open
 * @access  Public (Workers browse available jobs)
 */
export const getAllOpenShifts = async (req, res, next) => {
  try {
    // Find all shifts with status 'open'
    const shifts = await Shift.find({ status: "open" })
      .populate("hirerId", "fullName email phone")
      .sort({ date: 1 }); // Sort by date, earliest first (upcoming jobs)

    res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts,
    });
  } catch (error) {
    console.error("Get open shifts error:", error);
    next(error);
  }
};

/**
 * @desc    Get shift details WITH bids (for Hirer to see applicants)
 * @route   GET /api/shifts/:id/details
 * @access  Private (Hirer only - can only view their own shifts)
 */
export const getShiftDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const cleanId = id.trim();

    console.log('📊 Fetching shift details - Shift ID:', cleanId, 'User ID:', userId);

    // Validate ID format
    const mongoose = await import('mongoose');
    if (!mongoose.default.Types.ObjectId.isValid(cleanId)) {
      console.log('❌ Invalid Shift ID format:', cleanId);
      return res.status(400).json({
        success: false,
        message: "Invalid Shift ID format"
      });
    }

    // Find the shift
    const shift = await Shift.findById(cleanId)
      .populate("hirerId", "fullName email phone");

    if (!shift) {
      console.log('❌ Shift not found:', id);
      return res.status(404).json({
        success: false,
        message: "Shift not found"
      });
    }

    console.log('✅ Shift found:', shift.title);
    console.log('🔍 Shift hirerId:', shift.hirerId);
    console.log('🔍 Requesting userId:', userId);

    // Make sure the person viewing is the one who posted it
    // After populate, hirerId is an object with _id property
    const hirerIdString = shift.hirerId._id ? shift.hirerId._id.toString() : shift.hirerId.toString();

    console.log('🔍 Comparing:', hirerIdString, '===', userId);

    if (hirerIdString !== userId) {
      console.log('❌ Authorization failed - User is not the shift owner');
      return res.status(403).json({
        success: false,
        message: "You can only view your own shift details"
      });
    }

    console.log('✅ Authorization passed');

    // Find all bids for this shift
    const bids = await Bid.find({ shiftId: cleanId })
      .populate({
        path: "workerId",
        select: "fullName email phone"
      })
      .sort({ createdAt: -1 }); // Newest bids first

    console.log(`📋 Found ${bids.length} bids for this shift`);

    // Fetch helper profiles for additional info
    const HelperProfile = (await import("../models/helperProfile.js")).default;

    const bidsWithProfiles = await Promise.all(
      bids.map(async (bid) => {
        const helperProfile = await HelperProfile.findOne({
          user: bid.workerId._id
        }).select("averageRating totalJobsCompleted skillCategory");

        return {
          _id: bid._id,
          bidAmount: bid.bidAmount,
          estimatedArrivalTime: bid.estimatedArrivalTime,
          message: bid.message,
          status: bid.status,
          createdAt: bid.createdAt,
          worker: {
            id: bid.workerId._id,
            name: bid.workerId.fullName,
            email: bid.workerId.email,
            phone: bid.workerId.phone,
            rating: helperProfile?.averageRating || 0,
            jobsCompleted: helperProfile?.totalJobsCompleted || 0,
            skillCategory: helperProfile?.skillCategory || "N/A"
          }
        };
      })
    );

    console.log('✅ Successfully prepared response with shift details and bids');

    res.status(200).json({
      success: true,
      data: {
        shift: {
          _id: shift._id,
          title: shift.title,
          description: shift.description,
          category: shift.category,
          pay: shift.pay,
          location: shift.location,
          date: shift.date,
          time: shift.time,
          skills: shift.skills,
          status: shift.status,
          hirer: shift.hirerId
        },
        bids: bidsWithProfiles,
        totalBids: bidsWithProfiles.length
      }
    });
  } catch (error) {
    console.error("❌ Get shift details error:", error);
    console.error("Error stack:", error.stack);
    next(error);
  }
};

/**
 * Complete a shift and update statistics
 * This function:
 * - Changes shift status to 'completed'
 * - Updates Worker's jobsCompleted count by +1
 * - Updates Hirer's totalHires count by +1
 * @route PUT /api/shifts/:shiftId/complete
 * @access Private (Hirer only - shift owner)
 */
export const completeShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const userId = req.user._id || req.user.id;

    // Step 1: Find the shift
    const shift = await Shift.findById(shiftId);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found"
      });
    }

    // Step 2: Fetch assigned worker if not directly on shift object
    let assignedWorkerId = shift.worker || shift.selectedWorker;

    if (!assignedWorkerId) {
      const acceptedBid = await Bid.findOne({ shiftId, status: 'accepted' });
      if (acceptedBid) {
        assignedWorkerId = acceptedBid.workerId;
        // Partially update the shift so future calls are faster
        await Shift.findByIdAndUpdate(shiftId, {
          worker: assignedWorkerId,
          selectedWorker: assignedWorkerId
        });
        console.log(`✅ Fixed shift ${shiftId} by adding missing worker ${assignedWorkerId}`);
      }
    }

    // Step 3: Security check - hirer OR assigned worker can complete the shift
    const isHirer = shift.hirerId.toString() === userId.toString();
    const isWorker = assignedWorkerId && assignedWorkerId.toString() === userId.toString();

    if (!isHirer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: "Only the shift owner or assigned worker can mark it as completed"
      });
    }

    // Step 4: Check if shift is already completed
    if (shift.status === 'completed') {
      return res.status(200).json({
        success: true,
        message: "Shift is already marked as completed",
        data: {
          shift: {
            _id: shift._id,
            title: shift.title,
            status: shift.status
          }
        }
      });
    }

    // Step 5: Final validation
    if (!assignedWorkerId) {
      return res.status(400).json({
        success: false,
        message: "Cannot complete shift without an assigned worker"
      });
    }

    // Step 6: Update shift status to 'completed'
    shift.status = 'completed';
    await shift.save();

    // Step 7: Update Worker's statistics (jobsCompleted +1)
    const workerId = assignedWorkerId;
    const HelperProfile = (await import("../models/helperProfile.js")).default;
    const helperProfile = await HelperProfile.findOne({ user: workerId });
    if (helperProfile) {
      helperProfile.totalJobsCompleted = (helperProfile.totalJobsCompleted || 0) + 1;
      await helperProfile.save();
      console.log(`✅ Worker stats updated: jobsCompleted = ${helperProfile.totalJobsCompleted}`);
    }

    // Step 7: Update Hirer's statistics (totalHires +1)
    const hirer = await User.findById(shift.hirerId);
    if (hirer) {
      hirer.totalHires = (hirer.totalHires || 0) + 1;
      await hirer.save();
      console.log(`✅ Hirer stats updated: totalHires = ${hirer.totalHires}`);
    }

    // Step 8: Send success response
    res.status(200).json({
      success: true,
      message: "Shift marked as completed successfully. Stats have been updated.",
      data: {
        shift: {
          _id: shift._id,
          title: shift.title,
          status: shift.status
        }
      }
    });

  } catch (error) {
    console.error("Error completing shift:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete shift", error: error.message
    });
  }
};
