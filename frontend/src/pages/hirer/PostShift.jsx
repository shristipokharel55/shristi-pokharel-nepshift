import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../../utils/api";
import HirerLayout from "../../components/hirer/HirerLayout";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map clicks and update marker position
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      // When user clicks on the map, update the marker position
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function PostShift() {
  const navigate = useNavigate();

  // Form state - keeping track of all input values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    payMin: "",
    payMax: "",
    address: "",
    city: "",
    date: "",
    startTime: "",
    endTime: "",
    skills: "",
  });

  // Map state - where the user clicked on the map
  const [mapPosition, setMapPosition] = useState({
    lat: 27.7172, // Default: Kathmandu coordinates
    lng: 85.324,
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // List of available categories
  const categories = [
    "Construction",
    "Marketing",
    "Delivery",
    "Event Staff",
    "Cleaning",
    "Security",
    "Teaching",
    "Data Entry",
    "Customer Service",
    "Other",
  ];

  // Update form fields as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // When user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simple validation
      if (!formData.title || !formData.category || !formData.payMin || !formData.payMax) {
        throw new Error("Please fill in all required fields");
      }

      if (Number(formData.payMin) > Number(formData.payMax)) {
        throw new Error("Minimum pay cannot be greater than maximum pay");
      }

      if (!formData.date || !formData.startTime || !formData.endTime) {
        throw new Error("Please select date and time");
      }

      // Prepare shift data
      const shiftData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        pay: {
          min: Number(formData.payMin),
          max: Number(formData.payMax),
        },
        location: {
          address: formData.address || "Location on map",
          city: formData.city || "Kathmandu",
          coordinates: {
            lat: mapPosition.lat,
            lng: mapPosition.lng,
          },
        },
        date: formData.date,
        time: {
          start: formData.startTime,
          end: formData.endTime,
        },
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(s => s) : [],
      };

      console.log("Posting shift:", shiftData);

      // Post to backend
      const response = await api.post("/shifts", shiftData);

      if (response.data.success) {
        navigate("/hirer/manage-jobs");
      }
    } catch (err) {
      console.error("Shift post error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to post shift";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HirerLayout>
      <div className="min-h-screen bg-[#E0F0F3] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#032A33]">Post a New Shift</h1>
            <p className="text-[#888888] mt-2">Fill in the details to post your shift and find the right worker</p>
          </div>

          {/* Show error message if there's any */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Need Construction Worker for 1 Day"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the work, requirements, and any important details..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
              />
            </div>

            {/* Pay Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">
                  Minimum Pay (NPR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="payMin"
                  value={formData.payMin}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">
                  Maximum Pay (NPR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="payMax"
                  value={formData.payMax}
                  onChange={handleChange}
                  placeholder="e.g., 1000"
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Location - Map */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Select Location on Map <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-[#888888] mb-3">Click on the map to set the exact location for this shift</p>

              {/* Leaflet Map */}
              <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                  center={[mapPosition.lat, mapPosition.lng]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={mapPosition} setPosition={setMapPosition} />
                </MapContainer>
              </div>

              {/* Show selected coordinates */}
              <p className="text-sm text-[#888888] mt-2">
                Selected: Lat {mapPosition.lat.toFixed(6)}, Lng {mapPosition.lng.toFixed(6)}
              </p>
            </div>

            {/* Address and City (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">Address (Optional)</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., Thamel, Kathmandu"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Kathmandu"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">
                Shift Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} // Can't select past dates
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                required
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-[#032A33] mb-2">Required Skills (Optional)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Carpentry, Heavy Lifting (separate with commas)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
              />
              <p className="text-sm text-[#888888] mt-1">Separate multiple skills with commas</p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#0B4B54] text-white py-3 rounded-lg font-medium hover:bg-[#0D5A65] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Post Shift"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/hirer/dashboard")}
                className="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </HirerLayout>
  );
}
