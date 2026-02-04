// backend/src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { getClearCookieOptions, getCookieOptions } from "../utils/cookieOptions.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set in environment variables.");
}

/**
 * Helper: normalize location key in request body (accepts both 'Location' and 'location')
 */
const getLocationFromBody = (body) => {
  return (body.location || body.Location || "").toString();
};

/**
 * Register user
 * - hash password
 * - optional: create user with role (helper/hirer)
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, role, password } = req.body;
    const location = getLocationFromBody(req.body);

    // Validate required fields (location is optional now)
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      fullName,
      email,
      phone,
      location: location ? location.toLowerCase() : 'Not Provided', // Default if not provided
      role: role || "helper",
      password: hashed,
      // fields for reset/otp left null by default
      resetOtp: null,
      resetOtpExpires: null,
      resetOtpVerifiedAt: null,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Register Hirer (Simplified)
 * @route POST /api/auth/register-hirer
 */
export const registerHirer = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check required fields
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'hirer',
      location: 'Not Provided', // Default placeholder as per requirements to skip map
      verificationStatus: 'unverified', // Default as per requirements
      isVerified: false
    });

    res.status(201).json({
      success: true,
      message: "Hirer account created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("registerHirer error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Login user - accepts email or phone in `email` field
 * - First checks for admin credentials from environment variables
 * - Then falls back to MongoDB database lookup
 * - compares hashed password
 * - sets JWT token in httpOnly cookie
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // `email` may be an email or phone string

    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    // Check for admin login via environment variables first
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL) {
      // Admin login attempt
      if (password === ADMIN_PASSWORD) {
        const token = jwt.sign(
          { id: "admin", role: "admin", email: ADMIN_EMAIL },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        res.cookie("token", token, getCookieOptions());

        return res.json({
          message: "Login successful",
          user: { id: "admin", fullName: "System Administrator", role: "admin", email: ADMIN_EMAIL },
        });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // Regular user login - check MongoDB
    const user = await User.findOne({ $or: [{ email }, { phone: email }] });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Set token in httpOnly cookie
    res.cookie("token", token, getCookieOptions());

    return res.json({
      message: "Login successful",
      user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Forgot password
 * - generate 6-digit OTP
 * - save to user.resetOtp and resetOtpExpires
 * - send OTP email using configured sendOtpEmail(email, otp)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // generate 6-digit OTP as string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.resetOtpVerifiedAt = null;
    await user.save();

    // Check if email credentials are configured
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.warn("Email credentials not configured. OTP:", otp);
      // In development, return success but log the OTP for testing
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        return res.json({ message: "OTP sent to registered email", devOtp: otp });
      }
      return res.status(500).json({ message: "Email service not configured" });
    }

    // send OTP email (implement sendOtpEmail in utils/sendEmail.js)
    try {
      await sendOtpEmail(user.email, otp);
    } catch (sendErr) {
      console.error("Failed to send OTP email:", sendErr);
      // In development, still return the OTP for testing
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        return res.json({ message: "Email failed but OTP generated", devOtp: otp });
      }
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    return res.json({ message: "OTP sent to registered email" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Verify OTP
 * - checks resetOtp and resetOtpExpires
 * - marks resetOtpVerifiedAt so resetPassword can be authorized
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.resetOtp || user.resetOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.resetOtpExpires) return res.status(400).json({ message: "OTP expired" });

    user.resetOtpVerifiedAt = Date.now();
    // clear OTP to avoid reuse (optional). We keep verifiedAt as proof.
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    return res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("verifyOTP error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Reset Password
 * - requires that resetOtpVerifiedAt exists and is recent (e.g. within 10 minutes)
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // require resetOtpVerifiedAt within last 10 minutes
    if (!user.resetOtpVerifiedAt || Date.now() - new Date(user.resetOtpVerifiedAt).getTime() > 10 * 60 * 1000) {
      return res.status(400).json({ message: "OTP not verified or expired. Please request a new OTP." });
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashed;
    user.resetOtpVerifiedAt = null; // clear verification
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Logout user - clears the httpOnly cookie
 */
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", getClearCookieOptions());
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logoutUser error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Get current user - validates session and returns user data
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the protect middleware

    // Admin check: if user is admin, req.user._id will be 'admin', which is NOT a valid ObjectId
    // So we handle it here explicitly
    if (req.user._id === 'admin') {
      return res.json({ user: req.user });
    }

    const user = await User.findById(req.user._id).select("-password -resetOtp -resetOtpExpires -resetOtpVerifiedAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};