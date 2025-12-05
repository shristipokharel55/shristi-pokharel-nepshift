import { useNavigate } from "react-router-dom";

export default function RegisterSelect() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role}`); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-teal-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Please select your role to continue
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSelect("helper")}
            className="py-3 px-4 rounded-xl border border-teal-400 hover:bg-teal-50 transition font-medium"
          >
            I’m a Helper
          </button>

          <button
            onClick={() => handleSelect("hirer")}
            className="py-3 px-4 rounded-xl border border-teal-400 hover:bg-teal-50 transition font-medium"
          >
            I’m a Hirer
          </button>
        </div>
      </div>
    </div>
  );
}
