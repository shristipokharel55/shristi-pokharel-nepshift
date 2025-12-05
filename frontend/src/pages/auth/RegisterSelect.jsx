import { useNavigate } from "react-router-dom";

export default function RegisterSelect() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    // navigate to helper register or hirer register
    navigate(`/register/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-[#CCE7E3]">
        
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Please select your role to continue
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSelect("helper")}
            className="py-3 px-4 rounded-xl border border-[#4A9287] text-[#4A9287] hover:bg-[#E6F4F2] transition font-medium"
          >
            I’m a Helper
          </button>

          <button
            onClick={() => handleSelect("hirer")}
            className="py-3 px-4 rounded-xl border border-[#4A9287] text-[#4A9287] hover:bg-[#E6F4F2] transition font-medium"
          >
            I’m a Hirer
          </button>
        </div>

      </div>
    </div>
  );
}
