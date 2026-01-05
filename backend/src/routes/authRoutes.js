import express from "express";
import { forgotPassword, googleLogin, loginUser, registerUser, resetPassword, verifyOTP } from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google-login", googleLogin);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.get( "/admin-only", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

export default router;
