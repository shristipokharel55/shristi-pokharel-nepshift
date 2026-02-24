import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, Navigation, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-hot-toast';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import HirerLayout from "../../components/hirer/HirerLayout";
import api from "../../utils/api";

// Colored markers
const destIcon = L.divIcon({
  html: `<div style="background:#e53e3e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
const userIcon = L.divIcon({
  html: `<div style="background:#3182ce;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({ destCoords, userCoords }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (!destCoords) return;
    if (userCoords && !fitted.current) {
      map.fitBounds(
        L.latLngBounds([[destCoords.lat, destCoords.lng], [userCoords.lat, userCoords.lng]]),
        { padding: [50, 50] }
      );
      fitted.current = true;
    } else if (!userCoords && !fitted.current) {
      map.setView([destCoords.lat, destCoords.lng], 15);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destCoords?.lat, destCoords?.lng, userCoords?.lat, userCoords?.lng]);
  return null;
}

export default function ManageJobs() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Navigation modal state
  const [showNavModal, setShowNavModal] = useState(false);
  const [navShiftCoords, setNavShiftCoords] = useState(null);
  const [navUserCoords, setNavUserCoords] = useState(null);
  const [navPathHistory, setNavPathHistory] = useState([]);
  const [navLoading, setNavLoading] = useState(false);
  const [navShiftTitle, setNavShiftTitle] = useState("");
  const [navShiftAddress, setNavShiftAddress] = useState("");
  const navWatchIdRef = useRef(null);

  useEffect(() => {
    fetchShifts();
  }, [filter]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      // If filter is "all", don't send status param
      const url = filter === "all" ? "/shifts/my-shifts" : `/shifts/my-shifts?status=${filter}`;
      const response = await api.get(url);

      if (response.data.success) {
        setShifts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (shiftId, newStatus) => {
    try {
      let response;
      if (newStatus === 'completed') {
        response = await api.put(`/shifts/${shiftId}/complete`);
      } else {
        response = await api.put(`/shifts/${shiftId}`, { status: newStatus });
      }

      if (response.data.success) {
        toast.success(`Shift marked as ${newStatus}`);
        fetchShifts(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleCloseNav = () => {
    if (navWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(navWatchIdRef.current);
      navWatchIdRef.current = null;
    }
    setShowNavModal(false);
    setNavShiftCoords(null);
    setNavUserCoords(null);
    setNavPathHistory([]);
  };

  const handleNavigate = (shift) => {
    const coords = shift.location?.coordinates;
    if (!coords?.lat || !coords?.lng) {
      toast.error("Shift location coordinates are not available.");
      return;
    }
    // Clear any previous watch
    if (navWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(navWatchIdRef.current);
    }
    setNavShiftTitle(shift.title);
    setNavShiftAddress(shift.location?.address || shift.location?.city || "");
    setNavShiftCoords({ lat: coords.lat, lng: coords.lng });
    setNavUserCoords(null);
    setNavPathHistory([]);
    setNavLoading(true);
    setShowNavModal(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setNavLoading(false);
      return;
    }
    navWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setNavUserCoords({ lat, lng });
        setNavPathHistory((prev) => [...prev, [lat, lng]]);
        setNavLoading(false);
      },
      () => {
        toast.error("Could not get your location. Map shows shift location only.");
        setNavLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <HirerLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#032A33]">Manage Shifts</h1>
            <p className="text-[#888888] mt-2">View and manage all your posted shifts</p>
          </div>
          <Link
            to="/hirer/post-shift"
            className="bg-[#0B4B54] text-white px-6 py-3 rounded-lg hover:bg-[#0D5A65] transition flex items-center gap-2"
          >
            <i className="ph ph-plus-circle text-lg"></i>
            Post New Shift
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-[#82ACAB]/20">
          <div className="flex items-center gap-4">
            <i className="ph ph-funnel text-xl text-[#888888]"></i>
            <div className="flex gap-2">
              {["all", "open", "in-progress", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                    ? "bg-[#0B4B54] text-white"
                    : "bg-[#D3E4E7] text-[#032A33] hover:bg-[#82ACAB]/30"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shifts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B54] mx-auto"></div>
            <p className="text-[#888888] mt-4">Loading shifts...</p>
          </div>
        ) : shifts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#82ACAB]/20">
            <i className="ph ph-briefcase text-6xl text-[#82ACAB] mb-4"></i>
            <h3 className="text-lg font-medium text-[#032A33] mb-2">No shifts found</h3>
            <p className="text-[#888888]">
              {filter === "all" ? "You haven't posted any shifts yet" : `No ${filter} shifts`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {shifts.map((shift) => (
              <div
                key={shift._id}
                className="bg-white rounded-xl shadow-sm p-6 border border-[#82ACAB]/20 hover:border-[#0B4B54] transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[#032A33]">{shift.title}</h3>

                      {/* Interactive Status Dropdown */}
                      <div className="relative">
                        <select value={shift.status} onChange={(e) => handleStatusChange(shift._id, e.target.value)}
                          className={`appearance-none px-3 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${getStatusColor(shift.status)}`}>
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                    </div>
                    <p className="text-[#888888]">{shift.description}</p>
                  </div>
                  <span className="bg-[#D3E4E7] text-[#0B4B54] px-3 py-1 rounded-full text-sm font-medium">
                    {shift.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-calendar text-lg"></i>
                    <span className="text-sm">{formatDate(shift.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-clock text-lg"></i>
                    <span className="text-sm">
                      {shift.time.start} - {shift.time.end}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-map-pin text-lg"></i>
                    <span className="text-sm">{shift.location.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-currency-dollar text-lg"></i>
                    <span className="text-sm">
                      NPR {shift.pay.min} - {shift.pay.max}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#82ACAB]/20">
                  <div className="flex items-center gap-2 text-[#888888]">
                    <i className="ph ph-users text-xl"></i>
                    <span className="font-medium">
                      {shift.applicants.length} applicant{shift.applicants.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {shift.status === 'in-progress' && (
                      <button
                        onClick={() => handleNavigate(shift)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#D3E4E7] text-[#032A33] rounded-lg hover:bg-[#82ACAB]/40 transition font-medium text-sm"
                      >
                        <Navigation size={16} />
                        Navigate
                      </button>
                    )}
                    <Link
                      to={`/hirer/shift/${shift._id}`}
                      className="text-[#0B4B54] hover:text-[#0D5A65] font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Modal */}
      {showNavModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="font-bold text-[#032A33] text-lg flex items-center gap-2">
                  <Navigation size={18} className="text-[#0B4B54]" />
                  Navigate to Shift
                </h3>
                <p className="text-sm text-[#888888]">{navShiftTitle}</p>
              </div>
              <button
                onClick={() => handleCloseNav()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="h-80 w-full relative">
              {navShiftCoords && (
                <MapContainer
                  center={[navShiftCoords.lat, navShiftCoords.lng]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitBounds destCoords={navShiftCoords} userCoords={navUserCoords} />
                  <Marker position={[navShiftCoords.lat, navShiftCoords.lng]} icon={destIcon} />
                  {navUserCoords && (
                    <>
                      <Marker position={[navUserCoords.lat, navUserCoords.lng]} icon={userIcon} />
                      {/* Traveled path */}
                      {navPathHistory.length > 1 && (
                        <Polyline
                          positions={navPathHistory}
                          pathOptions={{ color: '#3182ce', weight: 4, opacity: 0.8 }}
                        />
                      )}
                      {/* Remaining path to destination */}
                      <Polyline
                        positions={[[navUserCoords.lat, navUserCoords.lng], [navShiftCoords.lat, navShiftCoords.lng]]}
                        pathOptions={{ color: '#e53e3e', weight: 3, dashArray: '8 6', opacity: 0.8 }}
                      />
                    </>
                  )}
                </MapContainer>
              )}
              {navLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 gap-2">
                  <Loader2 size={28} className="animate-spin text-[#0B4B54]" />
                  <p className="text-sm font-medium text-[#032A33]">Getting your location...</p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-[#888888]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow inline-block"></span>
                  {navShiftAddress || "Shift location"}
                </span>
                {navUserCoords && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow inline-block"></span>
                    You
                  </span>
                )}
              </div>
              {navShiftCoords && (
                <a
                  href={`https://www.google.com/maps/dir/${navUserCoords ? `${navUserCoords.lat},${navUserCoords.lng}` : ''}/${navShiftCoords.lat},${navShiftCoords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#0B4B54] hover:underline whitespace-nowrap"
                >
                  Open in Google Maps →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </HirerLayout>
  );
}
