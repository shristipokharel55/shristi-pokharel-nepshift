import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.emailOrPhone,
        password: formData.password,
      });

      toast.success("Login successful");

      // persist token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user?.role || res.data.role);
      localStorage.setItem("user", JSON.stringify(res.data.user || {}));

      // role based redirect
      const role = res.data.user?.role;
      if (role === "helper") navigate("/helper/dashboard");
      else if (role === "hirer") navigate("/hirer/dashboard");
      else navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;
      if (!token) return toast.error("Google login failed");

      const res = await axios.post("http://localhost:5000/api/auth/google", { token });
      toast.success("Login successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user || {}));
      localStorage.setItem("role", res.data.user?.role || "helper");

      const role = res.data.user?.role || "helper";
      if (role === "helper") navigate("/helper/dashboard");
      else if (role === "hirer") navigate("/hirer/dashboard");
      else navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };

  const handleGoogleError = () => toast.error("Google Sign-In failed");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login to Nepshift</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email or Phone</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Enter your email or phone"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Enter password"
            />
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-[#4A9287] hover:underline">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full py-2 bg-[#4A9287] text-white rounded-lg hover:bg-[#407C74] transition">Login</button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-600 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <div className="flex flex-col gap-3">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <p className="text-center text-gray-700 mt-4">Don’t have an account? <Link to="/register" className="text-[#4A9287] font-medium hover:underline">Create Account</Link></p>
      </div>
    </div>
  );
}
