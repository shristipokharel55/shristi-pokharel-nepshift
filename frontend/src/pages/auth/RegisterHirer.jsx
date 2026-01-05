// src/pages/auth/RegisterHirer.jsx
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterHirer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });

  // control password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic client-side checks
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    (async () => {
        try {
          const payload = { ...formData, role: 'hirer', location: formData.location };
          const res = await axios.post('http://localhost:5000/api/auth/register', payload);
          toast.success(res.data.message || 'Registered');
          navigate('/login');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Something went wrong');
        }
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Create Hirer Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="e.g. Sita Sharma"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="+977 98XXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="City or use map later"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Company / Organisation (optional)</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Company name"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC] pr-12"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-8 text-xl"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙉" : "🙈"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC] pr-12"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-2 top-8 text-xl"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? "🙉" : "🙈"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#2B7A78] text-white rounded-lg hover:bg-[#246b67] transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#2B7A78] font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
