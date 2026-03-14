// src/pages/auth/RegisterHelper.jsx
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import locationData from "../../data/alllocation.json";
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
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#07A3B2]/20 focus:border-[#07A3B2] transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'
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
    province: "",
    district: "",
    municipality: "",
    password: "",
    confirmPassword: "",
  });

  const provinces = locationData.provinceList;
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    if (formData.province) {
      const prov = provinces.find((p) => p.name === formData.province);
      setDistricts(prov ? prov.districtList : []);
      setMunicipalities([]);
    } else {
      setDistricts([]);
      setMunicipalities([]);
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.district) {
      const dist = districts.find((d) => d.name === formData.district);
      setMunicipalities(dist ? dist.municipalityList : []);
    } else {
      setMunicipalities([]);
    }
  }, [formData.district, districts]);

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

  const validateLocation = (province, district, municipality) => {
    if (!province) return "Please select a province";
    if (!district) return "Please select a district";
    if (!municipality) return "Please select a municipality";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      setFormData((prev) => ({ ...prev, province: value, district: "", municipality: "" }));
    } else if (name === "district") {
      setFormData((prev) => ({ ...prev, district: value, municipality: "" }));
    } else {
      setFormData({ ...formData, [name]: value });
    }

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
      case 'province':
        error = !value ? 'Please select a province' : null;
        break;
      case 'district':
        error = !value ? 'Please select a district' : null;
        break;
      case 'municipality':
        error = !value ? 'Please select a municipality' : null;
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

    const locationError = validateLocation(formData.province, formData.district, formData.municipality);
    if (locationError) newErrors.province = locationError;

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
        location: [formData.municipality, formData.district, formData.province].filter(Boolean).join(", "),
        province: formData.province,
        district: formData.district,
        municipality: formData.municipality,
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 24px 56px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
          minHeight: "640px",
        }}
      >
        <div className="w-full md:w-[60%] px-6 md:px-10 py-10 overflow-y-auto">
          <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
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

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Create Helper Account</h2>
          <p className="text-sm text-gray-400 mb-5">Join our community of skilled workers.</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            {/* Location - Province / District / Municipality */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>

              {/* Province */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
                  <MapPin size={18} />
                </div>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#07A3B2]/20 focus:border-[#07A3B2] transition-colors appearance-none bg-white ${
                    errors.province ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
                  <MapPin size={18} />
                </div>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!formData.province}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#07A3B2]/20 focus:border-[#07A3B2] transition-colors appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.district ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Municipality */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
                  <MapPin size={18} />
                </div>
                <select
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!formData.district}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#07A3B2]/20 focus:border-[#07A3B2] transition-colors appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.municipality ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              {(errors.province || errors.district || errors.municipality) && (
                <p className="text-sm text-red-500">
                  {errors.province || errors.district || errors.municipality}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#07A3B2]/20 focus:border-[#07A3B2] transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#07A3B2] cursor-pointer"
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
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#07A3B2]/20 focus:border-[#07A3B2] transition-colors ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#07A3B2] cursor-pointer"
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
              className="w-full py-2.5 text-white rounded-lg font-semibold transition-all hover:opacity-90 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
              style={{
                background: "linear-gradient(90deg, #07A3B2 0%, #5dbf8a 100%)",
                boxShadow: "0 4px 14px rgba(7,163,178,0.35)",
              }}
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
          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#07A3B2] font-semibold hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-center mt-4">
            <Link to="/register" className="text-gray-500 hover:text-[#07A3B2] text-sm">
            ← Back to registration options
            </Link>
          </p>
          </div>
        </div>

        <div
          className="hidden md:flex md:w-[40%] flex-col items-center justify-center p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #07A3B2 0%, #4dbfa3 50%, #D9ECC7 100%)" }}
        >
          <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.14)" }} />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.12)" }} />

          <div className="relative z-10 w-full flex items-center justify-center" style={{ maxWidth: "300px" }}>
            <img
              src="/images/login-illustration.png"
              alt="NepShift illustration"
              className="w-full h-auto object-contain"
              style={{ maxHeight: "340px", borderRadius: "18px", filter: "drop-shadow(0 18px 36px rgba(0,0,0,0.2))" }}
            />
          </div>

          <div className="relative z-10 mt-6 text-center">
            <h3 className="text-white text-base font-bold leading-tight drop-shadow">Start Working Today</h3>
            <p className="text-white/80 text-xs mt-1">Complete your profile and discover nearby shifts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
