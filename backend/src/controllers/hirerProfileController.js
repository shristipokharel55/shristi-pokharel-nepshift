import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Shift from "../models/shift.js";
import User from "../models/user.js";
import { calculateHirerProfileCompletion, canSubmitForVerification } from "../utils/profileCompletion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration for hirer document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hirer-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG) and PDFs are allowed'));
    }
  }
});

/**
 * Get Hirer Profile
 * @route   GET /api/hirer/profile
 * @access  Private (Hirer only)
 */
export const getHirerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetOtp -resetOtpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate profile completion percentage
    const profileCompletion = calculateHirerProfileCompletion(user);

    // Get actual statistics from database
    const totalHires = user.totalHires || 0;
    
    // Get completed shifts count
    const completedShifts = await Shift.countDocuments({
      hirerId: user._id,
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        profileCompletion,
        stats: {
          totalHires,
          completedShifts,
          memberSince: user.joinedAt || user.createdAt
        },
        canSubmitForVerification: canSubmitForVerification(user)
      }
    });
  } catch (error) {
    console.error('Get hirer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * Update Hirer Basic Profile
 * @route   PUT /api/hirer/profile
 * @access  Private (Hirer only)
 */
export const updateHirerProfile = async (req, res) => {
  try {
    const { fullName, phone, bio, address } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    
    if (address) {
      user.address = {
        latitude: address.latitude || user.address?.latitude,
        longitude: address.longitude || user.address?.longitude,
        district: address.district || user.address?.district,
        municipality: address.municipality || user.address?.municipality,
        ward: address.ward || user.address?.ward,
        street: address.street || user.address?.street
      };
    }

    await user.save();

    // Calculate updated profile completion
    const profileCompletion = calculateHirerProfileCompletion(user);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          ...user.toObject(),
          password: undefined,
          resetOtp: undefined,
          resetOtpExpires: undefined
        },
        profileCompletion,
        canSubmitForVerification: canSubmitForVerification(user)
      }
    });
  } catch (error) {
    console.error('Update hirer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * Upload Verification Documents
 * @route   POST /api/hirer/upload-documents
 * @access  Private (Hirer only)
 */
export const uploadVerificationDocuments = [
  upload.fields([
    { name: 'citizenshipFront', maxCount: 1 },
    { name: 'citizenshipBack', maxCount: 1 },
    { name: 'selfieWithId', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Initialize verificationDocs if it doesn't exist
      if (!user.verificationDocs) {
        user.verificationDocs = {};
      }

      // Update document URLs
      if (req.files.citizenshipFront) {
        user.verificationDocs.citizenshipFront = `/uploads/${req.files.citizenshipFront[0].filename}`;
      }
      if (req.files.citizenshipBack) {
        user.verificationDocs.citizenshipBack = `/uploads/${req.files.citizenshipBack[0].filename}`;
      }
      if (req.files.selfieWithId) {
        user.verificationDocs.selfieWithId = `/uploads/${req.files.selfieWithId[0].filename}`;
      }

      await user.save();

      // Calculate updated profile completion
      const profileCompletion = calculateHirerProfileCompletion(user);

      res.status(200).json({
        success: true,
        message: 'Documents uploaded successfully',
        data: {
          verificationDocs: user.verificationDocs,
          profileCompletion,
          canSubmitForVerification: canSubmitForVerification(user)
        }
      });
    } catch (error) {
      console.error('Upload documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload documents',
        error: error.message
      });
    }
  }
];

/**
 * Submit Profile for Verification
 * @route   POST /api/hirer/submit-verification
 * @access  Private (Hirer only)
 */
export const submitForVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if profile is complete enough
    if (!canSubmitForVerification(user)) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile and upload all required documents before submitting for verification'
      });
    }

    // Check if already verified or pending
    if (user.verificationStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Your profile is already verified'
      });
    }

    if (user.verificationStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Your verification request is already pending review'
      });
    }

    // Update verification status to pending
    user.verificationStatus = 'pending';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Verification request submitted successfully. Our team will review your documents within 1-2 business days.',
      data: {
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit verification request',
      error: error.message
    });
  }
};
