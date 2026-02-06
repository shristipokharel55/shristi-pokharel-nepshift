// backend/src/routes/helperRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
    canBidOnShifts,
    getAllWorkers,
    getHelperProfile,
    getVerificationStatus,
    getWorkerStats,
    submitVerification,
    updateHelperLocation,
    updateHelperProfile,
    uploadImage
} from "../controllers/helperController.js";
import {
    getHirerProfile,
    submitForVerification,
    updateHirerProfile,
    uploadPhoto,
    uploadVerificationDocuments
} from "../controllers/hirerProfileController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'citizenship-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Public route for hirers to browse workers
router.get('/workers', protect, authorizeRoles('hirer'), getAllWorkers);

// Helper routes - require authentication and helper role
router.get('/profile', protect, authorizeRoles('helper'), getHelperProfile);
router.put('/profile', protect, authorizeRoles('helper'), updateHelperProfile);
router.put('/location', protect, authorizeRoles('helper'), updateHelperLocation);
router.post('/verify', protect, authorizeRoles('helper'), submitVerification);
router.get('/verification-status', protect, authorizeRoles('helper'), getVerificationStatus);
router.post('/upload', protect, authorizeRoles('helper'), upload.single('image'), uploadImage);
router.get('/stats', protect, authorizeRoles('helper'), getWorkerStats);

// Hirer profile routes - require authentication and hirer role
router.get('/hirer/profile', protect, authorizeRoles('hirer'), getHirerProfile);
router.put('/hirer/profile', protect, authorizeRoles('hirer'), updateHirerProfile);
router.post('/hirer/upload-documents', protect, authorizeRoles('hirer'), uploadVerificationDocuments);
router.post('/hirer/upload-photo', protect, authorizeRoles('hirer'), uploadPhoto);
router.post('/hirer/submit-verification', protect, authorizeRoles('hirer'), submitForVerification);

// Check if helper can bid on shifts
router.get('/can-bid', protect, authorizeRoles('helper'), canBidOnShifts);

export default router;
