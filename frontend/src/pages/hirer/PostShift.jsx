import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlertCircle, ArrowRight, CheckCircle, Loader2, Locate, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";
import { useAuth } from "../../context/AuthContext";
import locationData from "../../data/alllocation.json";
import api from "../../utils/api";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Fly map to new coordinates when they change
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
    }
  }, [lat, lng, map]);
  return null;
}

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
  const { user } = useAuth();

  // Form state - keeping track of all input values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    payMin: "",
    payMax: "",
    province: "",
    district: "",
    municipality: "",
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
  const [locating, setLocating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);

  // Cascading location data
  const provinces = locationData.provinceList;
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    if (formData.province) {
      const prov = provinces.find((p) => p.name === formData.province);
      setDistricts(prov ? prov.districtList : []);
      setMunicipalities([]);
    } else {
      setDistricts([]);
      setMunicipalities([]);
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.district) {
      const dist = districts.find((d) => d.name === formData.district);
      setMunicipalities(dist ? dist.municipalityList : []);
    } else {
      setMunicipalities([]);
    }
  }, [formData.district, districts]);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        setCheckingVerification(true);
        const response = await api.get('/helper/hirer/profile');
        if (response.data.success) {
          setIsVerified(response.data.data.user.verificationStatus === 'approved');
        }
      } catch (error) {
        console.error("Failed to check verification status:", error);
      } finally {
        setCheckingVerification(false);
      }
    };

    checkVerificationStatus();
  }, []);

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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapPosition({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve location. Please allow location access.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Update form fields as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset dependent fields on parent change
    if (name === "province") {
      setFormData((prev) => ({ ...prev, province: value, district: "", municipality: "" }));
      return;
    }
    if (name === "district") {
      setFormData((prev) => ({ ...prev, district: value, municipality: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          address: [formData.municipality, formData.district, formData.province].filter(Boolean).join(", "),
          city: formData.district || "Kathmandu",
          province: formData.province,
          district: formData.district,
          municipality: formData.municipality,
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

  if (checkingVerification) {
    return (
      <HirerLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#E0F0F3]">
          <Loader2 className="w-10 h-10 animate-spin text-[#0B4B54]" />
        </div>
      </HirerLayout>
    );
  }

  if (!isVerified) {
    return (
      <HirerLayout>
        <div className="min-h-screen bg-[#E0F0F3] p-6 flex items-center justify-center">
          <div className="max-w-xl w-full text-center">
            <div className="glass-card rounded-3xl p-10 bg-white shadow-xl">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={40} className="text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#032A33] mb-4">Identity Verification Required</h2>
              <p className="text-[#888888] mb-8 text-lg font-medium leading-relaxed">
                To ensure a safe community for workers, all employers must verify their identity before posting shifts.
                This process only takes a few minutes.
              </p>

              <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium">Upload government-issued ID</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium">Take a real-time authentication selfie</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 mt-1 shrink-0" />
                  <p className="text-sm text-gray-600 font-medium">Get verified in 24-48 business hours</p>
                </div>
              </div>

              <Link
                to="/hirer/verify"
                className="w-full inline-flex items-center justify-center gap-3 bg-[#0B4B54] text-white py-4 rounded-2xl font-bold hover:bg-[#032A33] transition-all shadow-lg shadow-[#0B4B54]/20 group cursor-pointer active:scale-95"
              >
                <span>Get Verified Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="mt-6 text-xs text-[#888888] font-bold uppercase tracking-widest">
                Safe & Secure via NepShift Trust
              </p>
            </div>

            <button
              onClick={() => navigate('/hirer/dashboard')}
              className="mt-8 text-[#0B4B54] font-bold hover:underline cursor-pointer transition-all active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </HirerLayout>
    );
  }

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
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 font-medium">
              <AlertCircle size={20} />
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
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#888888]">Click on the map to set the exact location for this shift</p>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B4B54] text-white text-sm font-medium rounded-lg hover:bg-[#0D5A65] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {locating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Locate size={15} />
                      Use My Location
                    </>
                  )}
                </button>
              </div>

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
                  <RecenterMap lat={mapPosition.lat} lng={mapPosition.lng} />
                  <LocationMarker position={mapPosition} setPosition={setMapPosition} />
                </MapContainer>
              </div>

              {/* Show selected coordinates */}
              <p className="text-sm text-[#888888] mt-2">
                Selected: Lat {mapPosition.lat.toFixed(6)}, Lng {mapPosition.lng.toFixed(6)}
              </p>
            </div>

            {/* Province / District / Municipality */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.province}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#032A33] mb-2">
                  Municipality <span className="text-red-500">*</span>
                </label>
                <select
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  disabled={!formData.district}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
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
                className="flex-1 bg-[#0B4B54] text-white py-3 rounded-lg font-medium hover:bg-[#0D5A65] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow-md hover:shadow-lg"
              >
                {loading ? "Posting..." : "Post Shift"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/hirer/dashboard")}
                className="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
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
