import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email || localStorage.getItem('resetEmail');

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        newPassword: password
      });

      toast.success("Password reset successful!");
      // cleanup
      localStorage.removeItem('resetEmail');
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
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

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              required
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
