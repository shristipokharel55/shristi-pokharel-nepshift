// src/pages/worker/CompleteProfile.jsx
import {
  AlertCircle,
  Briefcase,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Save
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import WorkerLayout from "../../components/worker/WorkerLayout";
import api from "../../utils/api";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      toast.success("Location selected!");
    },
  });

  return position ? <Marker position={position} /> : null;
};

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [profile, setProfile] = useState({
    skillCategory: "",
    yearsOfExperience: "",
    aboutMe: "",
    hourlyRate: "",
    location: {
      address: "",
      city: "",
      coordinates: {
        latitude: null,
        longitude: null
      }
    }
  });
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Default center (Kathmandu)
  const defaultCenter = { lat: 27.7172, lng: 85.3240 };

  // Fetch existing profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/helper/profile");

      const data = res.data.data;
      // If profile exists (even if partial), populate state
      if (res.data.success && data) {
        setHasExistingProfile(true);
        setProfile({
          skillCategory: data.skillCategory || "",
          yearsOfExperience: data.yearsOfExperience?.toString() || "",
          aboutMe: data.aboutMe || "",
          hourlyRate: data.hourlyRate?.toString() || "",
          location: data.location || {
            address: "",
            city: "",
            coordinates: { latitude: null, longitude: null }
          }
        });
        setCompletionPercentage(data.profileCompletionPercentage || 0);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMapClick = (latlng) => {
    setProfile(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          latitude: latlng.lat,
          longitude: latlng.lng
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.skillCategory) {
      toast.error("Please select a skill category");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        skillCategory: profile.skillCategory,
        yearsOfExperience: parseInt(profile.yearsOfExperience) || 0,
        aboutMe: profile.aboutMe,
        hourlyRate: parseFloat(profile.hourlyRate) || 0,
        location: {
          // We keep address/city if they existed, but don't show inputs anymore.
          // Map coordinates are the primary source now.
          address: profile.location.address,
          city: profile.location.city,
          latitude: profile.location.coordinates?.latitude,
          longitude: profile.location.coordinates?.longitude
        }
      };

      const res = await api.put("/helper/profile", payload);

      if (res.data.success) {
        toast.success(hasExistingProfile ? "Profile updated successfully!" : "Profile created successfully!");
        setHasExistingProfile(true);
        setCompletionPercentage(res.data.data?.profileCompletionPercentage || completionPercentage);
        // Optional: navigate back or stay
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <WorkerLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9287]" />
        </div>
      </WorkerLayout>
    );
  }

  // Determine map center and marker position
  const mapCenter = (profile.location?.coordinates?.latitude && profile.location?.coordinates?.longitude)
    ? { lat: profile.location.coordinates.latitude, lng: profile.location.coordinates.longitude }
    : defaultCenter;

  const markerPosition = (profile.location?.coordinates?.latitude && profile.location?.coordinates?.longitude)
    ? { lat: profile.location.coordinates.latitude, lng: profile.location.coordinates.longitude }
    : null;

  return (
    <WorkerLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#032A33]">
            {hasExistingProfile ? "Update Your Profile" : "Complete Your Profile"}
          </h1>
          <p className="text-gray-500 mt-2">
            Fill in your details to start receiving job opportunities
          </p>
        </div>

        {/* Profile Completion Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-700">Profile Completion</span>
            <span className={`text-lg font-bold ${completionPercentage >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${completionPercentage >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          {completionPercentage < 80 ? (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <AlertCircle size={14} />
              Complete at least 80% to appear in search results.
            </p>
          ) : completionPercentage < 100 ? (
            <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
              You're ready to work! Verify your identity to reach 100%.
            </p>
          ) : (
            <p className="text-sm text-emerald-600 mt-2 font-medium">
              Profile 100% Complete!
            </p>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skill Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#4A9287]/10 flex items-center justify-center">
                <Briefcase size={20} className="text-[#4A9287]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Skill Category</h3>
                <p className="text-sm text-gray-500">What type of work do you specialize in?</p>
              </div>
            </div>
            <select
              name="skillCategory"
              value={profile.skillCategory}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287] bg-white"
            >
              <option value="">Select your main skill</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Gardening">Gardening</option>
              <option value="General Labour">General Labour</option>
              <option value="Cooking">Cooking</option>
              <option value="Delivery">Delivery</option>
              <option value="Painting">Painting</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Experience & Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Years of Experience */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Clock size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Experience</h3>
                  <p className="text-sm text-gray-500">Years in this field</p>
                </div>
              </div>
              <input
                type="number"
                name="yearsOfExperience"
                value={profile.yearsOfExperience}
                onChange={handleChange}
                min="0"
                max="50"
                placeholder="e.g., 3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287]"
              />
            </div>

            {/* Hourly Rate */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">₨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Hourly Rate</h3>
                  <p className="text-sm text-gray-500">Your expected rate (NPR)</p>
                </div>
              </div>
              <input
                type="number"
                name="hourlyRate"
                value={profile.hourlyRate}
                onChange={handleChange}
                min="0"
                placeholder="e.g., 500"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287]"
              />
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">About Me</h3>
                <p className="text-sm text-gray-500">Describe your skills and experience</p>
              </div>
            </div>
            <textarea
              name="aboutMe"
              value={profile.aboutMe}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              placeholder="Tell potential hirers about yourself, your skills, and what makes you a great worker..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A9287]/20 focus:border-[#4A9287] resize-none"
            />
            <p className="text-sm text-gray-400 mt-2 text-right">
              {profile.aboutMe.length}/500 characters
            </p>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <MapPin size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Location</h3>
                <p className="text-sm text-gray-500">Click on the map to set your location</p>
              </div>
            </div>

            {/* Leaflet Map */}
            <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 z-0 relative mb-4">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                  position={markerPosition}
                  setPosition={handleMapClick}
                />
              </MapContainer>
            </div>

            {/* Coordinates Display */}
            {profile.location.coordinates?.latitude ? (
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Selected Location</p>
                  <p className="text-xs text-gray-500">
                    Lat: {profile.location.coordinates.latitude.toFixed(6)},
                    Lng: {profile.location.coordinates.longitude.toFixed(6)}
                  </p>
                </div>
                <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  Active
                </div>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                Please click on the map to set your work location.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/worker/dashboard')}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#4A9287] text-white rounded-xl font-semibold hover:bg-[#407C74] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#4A9287]/20"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {hasExistingProfile ? 'Update Profile' : 'Save Profile'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </WorkerLayout>
  );
};

export default CompleteProfile;
