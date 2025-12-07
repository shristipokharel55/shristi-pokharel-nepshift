import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HelperDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const firstName = user?.fullName?.split(" ")[0] || "User";

  const [stats, setStats] = useState({
    earnings: 0,
    bids: 0,
    completed: 0,
  });

  return (
    <div className="min-h-screen flex bg-[#F4FBFA]">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
        
        <div>
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10 cursor-pointer"
               onClick={() => navigate("/helper/dashboard")}>
            <img src="/logo.svg" alt="logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold text-[#2D6159]">Nepshift</h1>
          </div>

          {/* NAV ITEMS */}
          <ul className="space-y-6 text-gray-700">
            <li 
              className="cursor-pointer hover:text-[#2D6159]"
              onClick={() => navigate("/helper/dashboard")}
            >
              📊 Dashboard
            </li>

            <li 
              className="cursor-pointer hover:text-[#2D6159]"
              onClick={() => navigate("/helper/shifts")}
            >
              📋 Available Shifts
            </li>

            <li 
              className="cursor-pointer hover:text-[#2D6159]"
              onClick={() => navigate("/helper/bids")}
            >
              🧾 My Bids & History
            </li>
          </ul>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="text-left text-red-500 hover:text-red-700"
        >
          ↩ Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">

        {/* TOP BAR */}
        <div className="flex justify-end items-center gap-6 mb-6">
          <button className="text-gray-600 hover:text-gray-800">
            💬
          </button>

          <button
            onClick={() => navigate("/helper/profile")}
            className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white hover:bg-gray-400"
          >
            👤
          </button>
        </div>

        {/* WELCOME BANNER */}
        <div className="bg-[#8ED6CC] text-white p-10 rounded-xl shadow-md mb-10">
          <h2 className="text-3xl font-semibold">Welcome back, {firstName}! </h2>
          <p className="mt-2 opacity-90">
            Your next opportunity is just a click away. Explore shifts tailored to your skills and location.
          </p>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-3 gap-6 mb-12">

          <div className="bg-white p-6 rounded-xl shadow border border-[#CCE7E3]">
            <p className="text-gray-600">Total Earnings</p>
            <h3 className="text-2xl font-bold">Rs {stats.earnings}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-[#CCE7E3]">
            <p className="text-gray-600">Active Bids</p>
            <h3 className="text-2xl font-bold">{stats.bids}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-[#CCE7E3]">
            <p className="text-gray-600">Shifts Completed</p>
            <h3 className="text-2xl font-bold">{stats.completed}</h3>
          </div>

        </div>

        {/* RECOMMENDED SHIFTS SECTION (Placeholder for now) */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommended Shifts</h3>

        <div className="text-gray-500">
          (Recommended shifts will appear here later…)
        </div>

      </div>
    </div>
  );
}
