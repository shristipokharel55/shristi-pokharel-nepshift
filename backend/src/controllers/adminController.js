// backend/src/controllers/adminController.js
import bcrypt from "bcrypt";
import HelperProfile from "../models/helperProfile.js";
import Notification from "../models/Notification.js";
import Shift from "../models/shift.js";
import User from "../models/user.js";
import transporter from "../utils/sendEmail.js";

/**
 * Get Dashboard Statistics
 * Returns zero-base counts that automatically update as data is added
 * @route GET /api/admin/stats
 * @access Admin only
 */
export const getDashboardStats = async (req, res) => {
  try {
    // User counts - will be 0 on fresh DB
    const totalUsers = await User.countDocuments();
    const totalHelpers = await User.countDocuments({ role: 'helper' });
    const totalHirers = await User.countDocuments({ role: 'hirer' });

    // Verification counts
    const pendingVerifications = await User.countDocuments({ verificationStatus: 'pending' });
    const approvedUsers = await User.countDocuments({ isVerified: true });
    const rejectedUsers = await User.countDocuments({ verificationStatus: 'rejected' });

    // Shift counts - will be 0 if no shifts exist
    const activeShifts = await Shift.countDocuments({ status: { $in: ['active', 'in_progress'] } });
    const openShifts = await Shift.countDocuments({ status: 'open' });
    const completedShifts = await Shift.countDocuments({ status: 'completed' });
    const totalShifts = await Shift.countDocuments();

    // Calculate revenue from completed shifts
    const revenueResult = await Shift.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPay' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly revenue for chart (last 12 months)
    const monthlyRevenue = await Shift.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' }
          },
          revenue: { $sum: '$totalPay' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // New users this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Last month for comparison
    const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Calculate trends
    const usersTrend = usersLastMonth > 0
      ? ((newUsersThisMonth - usersLastMonth) / usersLastMonth * 100).toFixed(1)
      : newUsersThisMonth > 0 ? 100 : 0;

    // Get recent verification requests for dashboard preview
    const recentVerifications = await User.find({ verificationStatus: 'pending' })
      .select('fullName email createdAt verificationStatus')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        // User stats
        totalUsers,
        totalHelpers,
        totalHirers,
        newUsersThisMonth,
        usersTrend: parseFloat(usersTrend),

        // Verification stats
        pendingVerifications,
        approvedUsers,
        rejectedUsers,

        // Shift stats
        totalShifts,
        activeShifts,
        openShifts,
        completedShifts,

        // Financial stats
        totalRevenue,
        monthlyRevenue,

        // Demographics for pie chart
        userDemographics: {
          helpers: totalHelpers,
          hirers: totalHirers,
          pendingVerification: pendingVerifications,
          inactive: await User.countDocuments({ isVerified: false, verificationStatus: { $ne: 'pending' } })
        },

        // Recent verification requests for dashboard preview
        recentVerifications
      }
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message
    });
  }
};

/**
 * Get all users with verification status
 * @route GET /api/admin/users
 * @access Admin only
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;

    // Build query
    const query = { role: { $ne: 'admin' } }; // Exclude admin users

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      if (status === 'verified') {
        query.isVerified = true;
      } else if (status === 'pending') {
        query.verificationStatus = 'pending';
      } else if (status === 'rejected') {
        query.verificationStatus = 'rejected';
      } else if (status === 'inactive') {
        query.isVerified = false;
      }
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -resetOtp -resetOtpExpires -resetOtpVerifiedAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

/**
 * Get users pending verification
 * @route GET /api/admin/verifications
 * @access Admin only
 */
export const getPendingVerifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;

    const query = {};

    if (status !== 'all') {
      query.verificationStatus = status;
    }

    const users = await User.find(query)
      .select('fullName email phone role location documents verificationStatus isVerified createdAt rejectionReason')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // For helper users, fetch their helper profile with citizenship documents
    const usersWithHelperData = await Promise.all(users.map(async (user) => {
      if (user.role === 'helper') {
        const helperProfile = await HelperProfile.findOne({ user: user._id })
          .select('citizenshipNumber citizenshipFrontImage citizenshipBackImage verificationStatus rejectionReason')
          .lean();

        if (helperProfile) {
          return {
            ...user,
            citizenshipNumber: helperProfile.citizenshipNumber,
            citizenshipFrontImage: helperProfile.citizenshipFrontImage,
            citizenshipBackImage: helperProfile.citizenshipBackImage,
            helperProfile: helperProfile
          };
        }
      }
      return user;
    }));

    const total = await User.countDocuments(query);

    // Get stats
    const stats = {
      total: await User.countDocuments(),
      pending: await User.countDocuments({ verificationStatus: 'pending' }),
      approved: await User.countDocuments({ verificationStatus: 'approved' }),
      rejected: await User.countDocuments({ verificationStatus: 'rejected' })
    };

    res.status(200).json({
      success: true,
      data: usersWithHelperData,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("getPendingVerifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching verification requests",
      error: error.message
    });
  }
};

/**
 * Update user verification status (Approve/Reject)
 * @route PUT /api/admin/verify/:userId
 * @access Admin only
 */
export const updateVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'approve' or 'reject'"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (action === 'approve') {
      user.isVerified = true;
      user.verificationStatus = 'approved';
      user.verifiedAt = new Date();

      // Only set verifiedBy if it's a valid database user (not the hardcoded 'admin')
      if (req.user._id !== 'admin') {
        user.verifiedBy = req.user._id;
      }

      user.rejectionReason = null;

      // Update all pending documents to approved
      if (user.documents && user.documents.length > 0) {
        user.documents = user.documents.map(doc => ({
          ...doc.toObject(),
          status: 'approved'
        }));
      }

      // If helper, also update helper profile
      if (user.role === 'helper') {
        await HelperProfile.findOneAndUpdate(
          { user: userId },
          {
            verificationStatus: 'verified',
            rejectionReason: null
          }
        );
      }

      // Send Approval Email
      try {
        await transporter.sendMail({
          from: `"Nepshift" <${process.env.MAIL_FROM}>`,
          to: user.email,
          subject: "Nepshift - Profile Verification Approved",
          text: `Dear ${user.fullName},\n\nYour profile verification has been approved! You can now start applying for shifts.\n\nBest regards,\nThe Nepshift Team`,
          html: `<p>Dear <b>${user.fullName}</b>,</p><p>Your profile verification has been <b>approved</b>! You can now start applying for shifts.</p><p>Best regards,<br>The Nepshift Team</p>`,
        });
      } catch (emailErr) {
        console.error("Failed to send approval email:", emailErr);
      }

    } else {
      user.isVerified = false;
      user.verificationStatus = 'rejected';
      user.rejectionReason = reason || 'Verification rejected by admin';

      // Update all pending documents to rejected
      if (user.documents && user.documents.length > 0) {
        user.documents = user.documents.map(doc => ({
          ...doc.toObject(),
          status: 'rejected'
        }));
      }

      // If helper, also update helper profile
      if (user.role === 'helper') {
        await HelperProfile.findOneAndUpdate(
          { user: userId },
          {
            verificationStatus: 'rejected',
            rejectionReason: reason || 'Verification rejected by admin'
          }
        );
      }

      // Send Rejection Email
      try {
        await transporter.sendMail({
          from: `"Nepshift" <${process.env.MAIL_FROM}>`,
          to: user.email,
          subject: "Nepshift - Profile Verification Update",
          text: `Dear ${user.fullName},\n\nYour profile verification was not approved.\nReason: ${reason || 'Documents did not meet requirements'}\n\nPlease update your profile and try again.\n\nBest regards,\nThe Nepshift Team`,
          html: `<p>Dear <b>${user.fullName}</b>,</p><p>Your profile verification was <b>not approved</b>.</p><p><b>Reason:</b> ${reason || 'Documents did not meet requirements'}</p><p>Please update your profile and try again.</p><p>Best regards,<br>The Nepshift Team</p>`,
        });
      } catch (emailErr) {
        console.error("Failed to send rejection email:", emailErr);
      }
    }

    await user.save();

    // Create Notification
    await Notification.create({
      recipient: user._id,
      type: action === 'approve' ? 'success' : 'error',
      title: action === 'approve' ? 'Profile Verified' : 'Verification Rejected',
      message: action === 'approve' 
        ? 'Your profile verification has been approved! You can now apply for shifts.' 
        : `Your verification was rejected. Reason: ${reason || 'Contact support'}`,
    });

    res.status(200).json({
      success: true,
      message: `User ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    console.error("updateVerificationStatus error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating verification status",
      error: error.message
    });
  }
};

/**
 * Get single user details
 * @route GET /api/admin/users/:userId
 * @access Admin only
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password -resetOtp -resetOtpExpires -resetOtpVerifiedAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get user's shift history
    const shifts = await Shift.find({
      $or: [
        { postedBy: userId },
        { assignedTo: userId }
      ]
    }).limit(10).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        shifts,
        shiftCount: await Shift.countDocuments({
          $or: [{ postedBy: userId }, { assignedTo: userId }]
        })
      }
    });
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
};

/**
 * Update user details (including password)
 * @route PUT /api/admin/users/:userId
 * @access Admin only
 */
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, role, password, location } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update basic fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (location) user.location = location;

    // Update password if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message
    });
  }
};

/**
 * Delete user
 * @route DELETE /api/admin/users/:userId
 * @access Admin only
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users"
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};

/**
 * Get recent activity for dashboard
 * @route GET /api/admin/activity
 * @access Admin only
 */
export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent users
    const recentUsers = await User.find()
      .select('fullName email role createdAt verificationStatus')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent shifts
    const recentShifts = await Shift.find()
      .populate('postedBy', 'fullName')
      .populate('assignedTo', 'fullName')
      .select('title status createdAt completedAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Combine and format activity
    const activity = [];

    recentUsers.forEach(user => {
      activity.push({
        type: 'user_registered',
        title: 'New user registered',
        description: `${user.fullName} joined as a ${user.role}`,
        timestamp: user.createdAt,
        icon: 'UserCheck',
        iconBg: 'bg-emerald-500'
      });
    });

    recentShifts.forEach(shift => {
      if (shift.status === 'completed') {
        activity.push({
          type: 'shift_completed',
          title: 'Shift completed',
          description: shift.title,
          timestamp: shift.completedAt || shift.createdAt,
          icon: 'CheckCircle',
          iconBg: 'bg-emerald-500'
        });
      } else {
        activity.push({
          type: 'shift_posted',
          title: 'New shift posted',
          description: shift.title,
          timestamp: shift.createdAt,
          icon: 'Briefcase',
          iconBg: 'bg-blue-500'
        });
      }
    });

    // Sort by timestamp and limit
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      data: activity.slice(0, limit)
    });
  } catch (error) {
    console.error("getRecentActivity error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching activity",
      error: error.message
    });
  }
};