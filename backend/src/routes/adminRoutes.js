// backend/src/routes/adminRoutes.js
import express from "express";
import {
    deleteUser,
    getAllUsers,
    getDashboardStats,
    getPendingVerifications,
    getRecentActivity,
    getUserById,
    updateUser,
    updateVerificationStatus
} from "../controllers/adminController.js";
import { protect, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

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

// Verification management
router.get("/verifications", getPendingVerifications);
router.put("/verify/:userId", updateVerificationStatus);

export default router;
