import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

      alert("OTP sent to your email!");
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">
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
            className="w-full py-2 bg-[#4A9287] text-white rounded-lg hover:bg-[#407C74]"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
