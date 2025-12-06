import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const SALT_ROUNDS = 10;

// Helper: normalize incoming location key (accept Location or location)
const getLocationFromBody = (body) => {
  return body.location || body.Location || "";
};

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

    await User.create({
      fullName,
      email,
      phone,
      location: location.toLowerCase(),
      role: role || "helper",
      password: hashed,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // email may be actual email or phone string

    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    // find by email OR by phone
    const user = await User.findOne({ $or: [{ email }, { phone: email }] });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ message: "Login successful", token, user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Keep basic verify/forgot/reset but ensure password hashing on reset
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    // if OTP logic not used, return not implemented
    return res.status(400).json({ message: "OTP verification not enabled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    return res.json({ message: "Forgot password flow not implemented (use reset with token)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashed;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
