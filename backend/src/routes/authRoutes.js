import express from "express";
import { forgotPassword, getCurrentUser, loginUser, logoutUser, registerHirer, registerUser, resetPassword, verifyOTP } from "../controllers/authController.js";
import { continueWithGoogle } from "../controllers/googleAuthController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-hirer", registerHirer);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", continueWithGoogle);
router.post("/google-login", continueWithGoogle);

// Protected route to get current user (validates session)
router.get("/me", protect, getCurrentUser);

router.get( "/admin-only", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

export default router;
