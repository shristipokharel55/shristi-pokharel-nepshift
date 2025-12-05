import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import otpGenerator from "../utils/otpGenerator.js";

const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, location, role, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const otp = otpGenerator();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    await User.create({
      fullName,
      email,
      phone,
      location,
      role,
      password: hashed,
      otp,
      otpExpires,
      verified:false
    });

    // In dev, return OTP for testing. In prod send via email/SMS.
    return res.json({
      message: "Registered. Verify OTP to activate account.",
      otp: process.env.NODE_ENV === "development" ? otp : undefined
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin permanent login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.json({ message: "Admin login successful", role: "admin", token: adminToken });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(403).json({ message: "Please verify your account via OTP" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT for user
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ message: "Login successful", token, user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 OTP Verification
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.verified) return res.status(400).json({ message: "Already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Forgot Password (send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = otpGenerator();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    res.json({ message: "OTP sent for password reset" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
