import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/forgot-password", { email });
      // persist email for OTP flow
      localStorage.setItem('resetEmail', email);
      
      // In development, if devOtp is returned, show it for testing
      if (res.data.devOtp) {
        toast.success(`OTP: ${res.data.devOtp} (Dev Mode)`);
      } else {
        toast.success(res.data.message || 'OTP sent to your email!');
      }
      
      navigate("/verify-otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-md bg-white p-7 rounded-2xl"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 24px 56px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <img src="/images/logo.png" alt="NepShift logo" className="h-8 w-auto object-contain" />
          <span
            className="text-xl font-bold"
            style={{
              background: "linear-gradient(90deg, #07A3B2, #5dbf8a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NepShift
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive an OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-[#8ED6CC]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-white rounded-lg hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
            style={{
              background: "linear-gradient(90deg, #07A3B2 0%, #5dbf8a 100%)",
              boxShadow: "0 4px 14px rgba(7,163,178,0.35)",
            }}
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
