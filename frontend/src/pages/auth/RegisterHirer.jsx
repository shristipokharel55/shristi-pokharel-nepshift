// src/pages/auth/RegisterHirer.jsx
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function RegisterHirer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const { fullName, email, phone, password, confirmPassword } = formData;
    
    if (!fullName.trim()) return "Full Name is required";
    
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";

    // Nepal Phone Validation (98/97 starting, 10 digits)
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(phone)) return "Invalid Nepal phone number (must start with 98 or 97)";

    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      await api.post('/auth/register-hirer', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      toast.success("Account created! Please login.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 24px 56px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
          minHeight: "580px",
        }}
      >
        <div className="w-full md:w-[52%] flex flex-col justify-center px-7 md:px-10 py-10 md:py-12">
          <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-7">
            <img src="/images/logo.png" alt="NepShift logo" className="h-10 w-auto object-contain" />
            <div>
              <span
                className="block text-xl font-bold leading-tight"
                style={{
                  background: "linear-gradient(90deg, #07A3B2, #5dbf8a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NepShift
              </span>
              <span className="block text-xs text-gray-400 leading-tight">Nepal's shift-work marketplace</span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Create Hirer Account</h1>
          <p className="text-sm text-gray-400 mb-6">Find reliable helpers for your shifts.</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#07A3B2] focus:ring-2 focus:ring-[#07A3B2]/20 outline-none transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#07A3B2] focus:ring-2 focus:ring-[#07A3B2]/20 outline-none transition-all"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#07A3B2] focus:ring-2 focus:ring-[#07A3B2]/20 outline-none transition-all"
              placeholder="98XXXXXXXX"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#07A3B2] focus:ring-2 focus:ring-[#07A3B2]/20 outline-none transition-all pr-10"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-[#07A3B2] cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#07A3B2] focus:ring-2 focus:ring-[#07A3B2]/20 outline-none transition-all pr-10"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-[#07A3B2] cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2.5 rounded-lg font-semibold transition-all mt-4 hover:opacity-90 active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(90deg, #07A3B2 0%, #5dbf8a 100%)",
              boxShadow: "0 4px 14px rgba(7,163,178,0.35)",
            }}
          >
            {loading ? "Creating Account..." : "Register as Hirer"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#07A3B2] font-semibold hover:underline">
            Login here
          </Link>
        </p>

        <p className="text-center mt-3 text-sm text-gray-500">
          <Link to="/register" className="hover:text-[#07A3B2] transition-colors">
            Back to registration options
          </Link>
        </p>
        </div>
      </div>

      <div
        className="hidden md:flex md:w-[48%] flex-col items-center justify-center p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #07A3B2 0%, #4dbfa3 50%, #D9ECC7 100%)" }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.15)" }} />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.12)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.06)" }} />

        <div className="relative z-10 w-full flex items-center justify-center" style={{ maxWidth: "320px" }}>
          <img
            src="/images/login-illustration.png"
            alt="NepShift illustration"
            className="w-full h-auto object-contain"
            style={{ maxHeight: "360px", borderRadius: "20px", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))" }}
          />
        </div>

        <div className="relative z-10 mt-7 text-center">
          <h3 className="text-white text-lg font-bold leading-tight drop-shadow">Hire Better. Faster.</h3>
          <p className="text-white/75 text-xs mt-1">Post shifts and connect with skilled helpers.</p>
        </div>
      </div>
    </div>
    </div>
  );
}
