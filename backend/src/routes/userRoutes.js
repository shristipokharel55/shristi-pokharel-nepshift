// backend/src/routes/userRoutes.js
import express from "express";
import { getPublicWorkerProfile } from "../controllers/userController.js";

const router = express.Router();

// Get public worker profile by ID
// This route is accessible to anyone (no authentication required)
// Hirers use this to view worker profiles before hiring
router.get("/worker/:id", getPublicWorkerProfile);

export default router;
