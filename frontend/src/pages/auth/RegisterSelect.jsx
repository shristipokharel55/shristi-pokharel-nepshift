import { useNavigate } from "react-router-dom";
import { User, Briefcase } from "lucide-react";

export default function RegisterSelect() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/images/logo.png" alt="NepShift logo" className="h-10 w-auto object-contain" />
          <span
            className="text-2xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(90deg, #07A3B2, #5dbf8a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NepShift
          </span>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-3">Join Nepshift</h1>
        <p className="text-gray-500 mb-10">Choose your role to get started.</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">

          {/* Helper Card */}
          <div
            onClick={() => handleSelect("helper")}
            className="w-64 cursor-pointer bg-white p-8 rounded-2xl transition border border-gray-200 hover:-translate-y-1"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07)" }}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #07A3B2, #5dbf8a)" }}>
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                I'm a Helper
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Find shifts and earn money
              </p>
            </div>
          </div>

          {/* Hirer Card */}
          <div
            onClick={() => handleSelect("hirer")}
            className="w-64 cursor-pointer bg-white p-8 rounded-2xl transition border border-gray-200 hover:-translate-y-1"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07)" }}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #07A3B2, #5dbf8a)" }}>
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                I'm a Hirer
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Post shifts and hire talent
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
