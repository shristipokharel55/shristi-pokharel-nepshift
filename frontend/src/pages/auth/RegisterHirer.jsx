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
    <div className="min-h-screen flex items-center justify-center bg-[#E0F0F3] px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#CCE7E3]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#032A33]">Hirer Registration</h1>
          <p className="text-[#888888] mt-2">Find the best helpers for your needs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#032A33] mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#032A33] mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#032A33] mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all"
              placeholder="98XXXXXXXX"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#032A33] mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all pr-10"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-[#888888] hover:text-[#0B4B54]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#032A33] mb-1">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/20 outline-none transition-all pr-10"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-[#888888] hover:text-[#0B4B54]"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B4B54] text-white py-3 rounded-xl font-semibold hover:bg-[#032A33] transition-colors shadow-lg shadow-[#0B4B54]/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register as Hirer"}
          </button>
        </form>

        <p className="text-center mt-6 text-[#888888]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0B4B54] font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
