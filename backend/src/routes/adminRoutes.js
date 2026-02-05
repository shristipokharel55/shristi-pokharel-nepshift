// backend/src/routes/adminRoutes.js
import express from "express";
import {
    approveHirerVerification,
    deleteUser,
    getAllUsers,
    getDashboardStats,
    getHirerVerificationRequests,
    getPendingVerifications,
    getRecentActivity,
    getUserById,
    rejectHirerVerification,
    updateUser,
    updateVerificationStatus
} from "../controllers/adminController.js";
import { protect, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Debug middleware to log all requests to admin routes
router.use((req, res, next) => {
  console.log('=== ADMIN ROUTE REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Full URL:', req.originalUrl);
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  next();
});

// All admin routes require authentication and admin role
router.use(protect);
router.use(verifyAdmin);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Recent activity
router.get("/activity", getRecentActivity);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

// Verification management (for helpers)
router.get("/verifications", getPendingVerifications);
router.put("/verify/:userId", updateVerificationStatus);

// Hirer verification management
router.get("/hirer-verifications", getHirerVerificationRequests);
router.put("/approve-hirer/:id", approveHirerVerification);
router.put("/reject-hirer/:id", rejectHirerVerification);

export default router;
