import User from "../models/user.js";
import otpGenerator from "../utils/otpGenerator.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, location, role, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const otp = otpGenerator();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    await User.create({
      fullName,
      email,
      phone,
      location,
      role,
      password,
      otp,
      otpExpires,
    });

    return res.json({
      message: "User registered successfully. Verify OTP to activate account.",
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
      return res.json({
        message: "Admin login successful",
        role: "admin",
        token,
      });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT for user
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user,
    });

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

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

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
