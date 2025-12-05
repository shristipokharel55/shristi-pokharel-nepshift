import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function RegisterPage() {
  const location = useLocation();
  const selectedRole = location.state?.role || "helper"; 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    role: selectedRole, 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // later you'll call backend API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA] px-4">
      
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-[#CCE7E3]">

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 mb-6 capitalize">
          Role selected: <span className="font-medium">{selectedRole}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="98XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
              placeholder="Enter your location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg focus:ring-2 focus:ring-[#8ED6CC]"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#4A9287] text-white rounded-lg hover:bg-[#407C74] transition"
          >
            Create Account
          </button>

        </form>

      </div>
    </div>
  );
}
