import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('resetEmail');

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next box
    if (value && index < 5) {
      document.getElementById(`otp-box-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp: finalOtp });

      toast.success(res.data.message || "OTP Verified Successfully!");
      // keep email for reset step
      localStorage.setItem('resetEmail', email);
      navigate("/reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Verify Your Account
        </h2>

        <p className="text-gray-600 text-center mb-4">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP Boxes */}
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-box-${index}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 text-center text-xl border border-[#8ED6CC] rounded-lg focus:ring-2 focus:ring-[#4A9287]"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#4A9287] text-white rounded-lg hover:bg-[#407C74] transition"
          >
            Verify OTP
          </button>
        </form>

      </div>
    </div>
  );
}
