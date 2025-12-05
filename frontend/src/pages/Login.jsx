import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // later we will call backend API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">
        
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login to Nepshift
        </h2>

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
            <a href="/forgot-password" className="text-sm text-[#4A9287] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#4A9287] text-white rounded-lg hover:bg-[#407C74] transition"
          >
            Login
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-600 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button className="w-full py-2 border border-[#CCE7E3] rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        <p className="text-center text-gray-700 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#4A9287] font-medium hover:underline">Create Account</Link>

        </p>
      </div>
    </div>
  );
}
