import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated, user, loading } = useAuth();

  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const role = user.role;
      if (role === "helper") navigate("/worker/dashboard", { replace: true });
      else if (role === "hirer") navigate("/hirer/dashboard", { replace: true });
      else if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.emailOrPhone, formData.password);
      toast.success("Login successful");
      const role = data.user?.role;
      if (role === "helper") navigate("/worker/dashboard", { replace: true });
      else if (role === "hirer") navigate("/hirer/dashboard", { replace: true });
      else if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;
      if (!credential) return toast.error("Google login failed");
      const data = await googleLogin(credential);
      toast.success("Login successful");
      const role = data.user?.role || "helper";
      if (role === "helper") navigate("/worker/dashboard", { replace: true });
      else if (role === "hirer") navigate("/hirer/dashboard", { replace: true });
      else if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };

  const handleGoogleError = () => toast.error("Google Sign-In failed");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07A3B2]"></div>
      </div>
    );
  }

  return (
    /* Plain white page */
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">

      <div
        className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 24px 56px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
          minHeight: "580px",
        }}
      >

        {/* ── LEFT: Form ── */}
        <div className="w-full md:w-[52%] flex flex-col justify-center px-10 py-12">

          {/* Logo + brand */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="NepShift logo"
              className="h-10 w-auto object-contain"
            />
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
              <span className="block text-xs text-gray-400 leading-tight">Nepal&apos;s shift-work marketplace</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-7">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Email or Phone
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-gray-700 bg-white focus:outline-none transition"
                  style={{ border: "1.5px solid #e2e8f0" }}
                  onFocus={(e) => (e.target.style.borderColor = "#07A3B2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#07A3B2]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-gray-700 bg-white focus:outline-none transition"
                  style={{ border: "1.5px solid #e2e8f0" }}
                  onFocus={(e) => (e.target.style.borderColor = "#07A3B2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#07A3B2] transition"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right -mt-1">
              <Link
                to="/forgot-password"
                className="text-xs font-medium hover:underline"
                style={{ color: "#07A3B2" }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-150"
              style={{
                background: "linear-gradient(90deg, #07A3B2 0%, #5dbf8a 100%)",
                boxShadow: "0 4px 14px rgba(7,163,178,0.35)",
              }}
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-3 text-gray-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>

          <p className="text-center text-gray-400 text-sm mt-7">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "#07A3B2" }}>
              Create Account
            </Link>
          </p>
        </div>

        {/* ── RIGHT: Illustration ── */}
        <div
          className="hidden md:flex md:w-[48%] flex-col items-center justify-center p-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #07A3B2 0%, #4dbfa3 50%, #D9ECC7 100%)",
          }}
        >
          {/* Decorative soft circles */}
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          {/* Illustration — centered with natural proportions */}
          <div className="relative z-10 w-full flex items-center justify-center" style={{ maxWidth: "320px" }}>
            <img
              src="/images/login-illustration.png"
              alt="NepShift illustration"
              className="w-full h-auto object-contain"
              style={{
                maxHeight: "360px",
                borderRadius: "20px",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))",
              }}
            />
          </div>

          {/* Tagline */}
          <div className="relative z-10 mt-7 text-center">
            <h3 className="text-white text-lg font-bold leading-tight drop-shadow">
              Find Shifts. Hire Faster.
            </h3>
            <p className="text-white/75 text-xs mt-1">Connect with workers across Nepal.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
