// src/pages/auth/RegisterHelper.jsx
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

const InputField = ({
  name,
  label,
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287] transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
          <AlertCircle size={18} />
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
        {error}
      </p>
    )}
  </div>
);

export default function RegisterHelper() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  // Validation functions
  const validateFullName = (name) => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 3) return "Name must be at least 3 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should only contain letters";
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required";
    // Nepal phone format: 98XXXXXXXX or 97XXXXXXXX (10 digits starting with 98 or 97)
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return "Enter valid Nepal phone (98XXXXXXXX or 97XXXXXXXX)";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    return null;
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return null;
  };

  const validateLocation = (location) => {
    if (!location) return "Please select your location";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
      case 'location':
        error = validateLocation(value);
        break;
    }

    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const locationError = validateLocation(formData.location);
    if (locationError) newErrors.location = locationError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\s/g, ''),
        location: formData.location,
        password: formData.password,
        role: "helper"
      };

      const res = await api.post("/auth/register", payload);
      toast.success(res.data.message || 'Registration successful!');
      navigate("/login", { state: { message: "Registration successful! Please log in." } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4FBFA] to-[#E8F5F3] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-[#4A9287]">NepShift</h1>
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Create Helper Account
          </h2>
          <p className="text-gray-500 mt-1">Join our community of skilled workers</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <InputField
              name="fullName"
              label="Full Name"
              icon={User}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
            />

            {/* Email */}
            <InputField
              name="email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
            />

            {/* Phone */}
            <InputField
              name="phone"
              label="Phone Number"
              icon={Phone}
              placeholder="98XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
            />

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MapPin size={18} />
                </div>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287] transition-colors appearance-none bg-white ${errors.location ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                >
                  <option value="">Select your location</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Itahari">Itahari</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Butwal">Butwal</option>
                  <option value="Hetauda">Hetauda</option>
                </select>
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287] transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Min 8 chars, uppercase, lowercase, and number required
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287] transition-colors ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A9287] text-white rounded-lg font-semibold hover:bg-[#407C74] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#4A9287] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Back to selection */}
        <p className="text-center mt-4">
          <Link to="/register" className="text-gray-500 hover:text-[#4A9287] text-sm">
            ← Back to registration options
          </Link>
        </p>
      </div>
    </div>
  );
}
