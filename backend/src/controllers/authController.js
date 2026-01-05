// backend/src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import { sendOtpEmail } from "../utils/sendEmail.js"; // implement this (nodemailer wrapper)

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // for google login

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

    if (!fullName || !email || !password || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      fullName,
      email,
      phone,
      location: location.toLowerCase(),
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
 * Login user - accepts email or phone in `email` field
 * - compares hashed password
 * - returns JWT token
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // `email` may be an email or phone string

    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ $or: [{ email }, { phone: email }] });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      message: "Login successful",
      token,
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

    // send OTP email (implement sendOtpEmail in utils/sendEmail.js)
    try {
      await sendOtpEmail(user.email, otp);
    } catch (sendErr) {
      console.error("Failed to send OTP email:", sendErr);
      // don't leak implementation detail to client
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
 * Google Login
 * - expects client to POST { token: <idToken from Google> }
 * - creates a new user if not present
 */
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required" });
    if (!GOOGLE_CLIENT_ID) return res.status(500).json({ message: "Google client ID not configured on server" });

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email) return res.status(400).json({ message: "Google account has no email" });

    let user = await User.findOne({ email });
    if (!user) {
      // create new user with random password (they can use googlesignin)
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashed = await bcrypt.hash(randomPassword, SALT_ROUNDS);
      user = await User.create({
        fullName: name || email.split("@")[0],
        email,
        password: hashed,
        role: "helper",
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      message: "Google login successful",
      token: jwtToken,
      user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email },
    });
  } catch (err) {
    console.error("googleLogin error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};