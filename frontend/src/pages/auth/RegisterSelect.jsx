import { useNavigate } from "react-router-dom";
import { User, Briefcase } from "lucide-react";

export default function RegisterSelect() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F8F7] px-4">
      <div className="text-center">
        
        {/* Heading */}
        <h1 className="text-3xl font-semibold text-[#0B3B36] mb-3">
          Join Nepshift
        </h1>

        <p className="text-gray-600 mb-10">
          Choose your role to get started.
        </p>

        {/* Role Selection Cards */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">

          {/* Helper Card */}
          <div
            onClick={() => handleSelect("helper")}
            className="w-64 cursor-pointer bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition border border-[#DDEBE9]"
          >
            <div className="flex flex-col items-center">
              <User className="h-10 w-10 text-[#0B3B36] mb-3" />
              <h3 className="text-lg font-semibold text-[#0B3B36]">
                I'm a Helper
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Find shifts and earn money
              </p>
            </div>
          </div>

          {/* Hirer Card */}
          <div
            onClick={() => handleSelect("hirer")}
            className="w-64 cursor-pointer bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition border border-[#DDEBE9]"
          >
            <div className="flex flex-col items-center">
              <Briefcase className="h-10 w-10 text-[#0B3B36] mb-3" />
              <h3 className="text-lg font-semibold text-[#0B3B36]">
                I'm a Hirer
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Post shifts and hire talent
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
