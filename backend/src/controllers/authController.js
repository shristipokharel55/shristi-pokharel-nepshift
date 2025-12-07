import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { transporter } from "../utils/email.js";
import otpGenerator from "../utils/otpGenerator.js";
import sendEmail from "../utils/sendEmail.js"; // we will create this

const SALT_ROUNDS = 10;

// REGISTER USER — WITH OTP GENERATION
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, role, password, location } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const otp = otpGenerator();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    await User.create({
      fullName,
      email,
      phone,
      role,
      password: hashed,
      location,
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendEmail(email, `Your OTP is ${otp}`);

    return res.json({ 
      message: "OTP sent to your email. Please verify to activate account.",
      email 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.otpExpires)
      return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN USER — ONLY VERIFIED USERS
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user =
      await User.findOne({ email }) ||
      await User.findOne({ phone: email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify OTP first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD — SEND OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // send email
    await sendEmail(
      user.email,
      "Your Nepshift OTP Code",
      `Your OTP code is: ${otp}`
    );

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// RESET PASSWORD USING OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.otpExpires)
      return res.status(400).json({ message: "OTP expired" });

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

    user.password = hashed;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
