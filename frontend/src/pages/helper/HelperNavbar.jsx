import { Link, useNavigate } from "react-router-dom";

export default function HelperNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-[#CCE7E3] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-semibold text-[#4A9287]">
          Nepshift
        </h1>

        {/* Nav Items */}
        <div className="flex gap-6 text-gray-700 font-medium">
          <Link to="/helper/dashboard" className="hover:text-[#4A9287]">Dashboard</Link>
          <Link to="/helper/find-shifts" className="hover:text-[#4A9287]">Find Shifts</Link>
          <Link to="/helper/bids" className="hover:text-[#4A9287]">My Bids</Link>
          <Link to="/helper/earnings" className="hover:text-[#4A9287]">Earnings</Link>
          <Link to="/helper/profile" className="hover:text-[#4A9287]">Profile</Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
