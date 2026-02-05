// backend/src/routes/helperRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
    canBidOnShifts,
    getHelperProfile,
    getVerificationStatus,
    submitVerification,
    updateHelperLocation,
    updateHelperProfile,
    uploadImage,
    getAllWorkers
} from "../controllers/helperController.js";
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

// All routes require authentication and helper role
router.use(protect);
router.use(authorizeRoles('helper'));

// Public route for hirers to browse workers
router.get('/workers', protect, authorizeRoles('hirer'), getAllWorkers);

// Profile routes
router.get('/profile', getHelperProfile);
router.put('/profile', updateHelperProfile);

// Location route
router.put('/location', updateHelperLocation);

// Verification routes
router.post('/verify', submitVerification);
router.get('/verification-status', getVerificationStatus);

// File upload route
router.post('/upload', upload.single('image'), uploadImage);

// Check if can bid
router.get('/can-bid', canBidOnShifts);

export default router;
