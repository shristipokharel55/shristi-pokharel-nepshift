import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function RegisterHelper() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    skillCategory: "",
    experience: "",
    password: "",
    confirmPassword: "",
    role: "helper",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Helper Register Data:", formData);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // ensure location key is lowercase
      const payload = { ...formData, location: formData.location };
      const res = await api.post("/auth/register", payload);
      toast.success(res.data.message || 'Registered');
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Helper Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Enter email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="98XXXXXXXX"
            />
          </div>

          {/* Location (Option B simple dropdown for now) */}
          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC] bg-white"
            >
              <option value="">Select your location</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Itahari">Itahari</option>
              <option value="Biratnagar">Biratnagar</option>
              <option value="Dharan">Dharan</option>
            </select>
          </div>

          {/* Skill Category */}
          <div>
            <label className="block text-gray-700 mb-1">Skill Category</label>
            <select
              name="skillCategory"
              value={formData.skillCategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC] bg-white"
            >
              <option value="">Select skill category</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Gardening">Gardening</option>
              <option value="General Labour">General Labour</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-700 mb-1">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="e.g., 1, 2, 3"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="Enter password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-xl"
              >
                {showPassword ? "🙉" : "🙈"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="Re-enter password"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2 cursor-pointer text-xl"
              >
                {showConfirm ? "🙉" : "🙈"}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-[#4A9287] text-white rounded-lg hover:bg-[#407C74] transition"
          >
            Register as Helper
          </button>

        </form>
      </div>
    </div>
  );
}
