import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Briefcase, Shield, Search, Filter, Loader2 } from "lucide-react";
import HirerLayout from "../../components/hirer/HirerLayout";
import api from "../../utils/api";

// Worker Card Component
const WorkerCard = ({ worker, delay }) => {
  const navigate = useNavigate();
  
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 border border-[#82ACAB]/20 hover:border-[#0B4B54] transition animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center text-white font-bold text-2xl shadow-md">
          {worker.fullName?.charAt(0) || "W"}
        </div>

        {/* Worker Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#032A33] text-lg">{worker.fullName || "Worker"}</h3>
            {worker.isVerified && (
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                <Shield size={12} />
                Verified
              </div>
            )}
          </div>

          {worker.profile && (
            <>
              <p className="text-[#0B4B54] font-medium text-sm mb-2">
                {worker.profile.skillCategory || "General Helper"}
                {worker.profile.yearsOfExperience && ` • ${worker.profile.yearsOfExperience} years exp.`}
              </p>

              {worker.profile.aboutMe && (
                <p className="text-[#888888] text-sm mb-3 line-clamp-2">{worker.profile.aboutMe}</p>
              )}
            </>
          )}

          {/* Worker Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-[#888888] mb-3">
            {worker.profile?.location?.city && (
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-[#82ACAB]" />
                <span>{worker.profile.location.city}</span>
              </div>
            )}
            {worker.profile?.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span>{worker.profile.averageRating.toFixed(1)}</span>
              </div>
            )}
            {worker.profile?.totalJobsCompleted > 0 && (
              <div className="flex items-center gap-1">
                <Briefcase size={14} className="text-[#82ACAB]" />
                <span>{worker.profile.totalJobsCompleted} jobs completed</span>
              </div>
            )}
            {worker.profile?.hourlyRate && (
              <div className="flex items-center gap-1">
                <span className="font-medium text-[#0B4B54]">NPR {worker.profile.hourlyRate}/hr</span>
              </div>
            )}
          </div>

          {/* Availability Status */}
          {worker.profile?.isAvailable !== undefined && (
            <div className="mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  worker.profile.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {worker.profile.isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[#82ACAB]/20">
        <button
          onClick={() => navigate(`/hirer/workers/${worker._id}`)}
          className="flex-1 bg-[#0B4B54] text-white py-2 rounded-lg font-medium hover:bg-[#0D5A65] transition"
        >
          View Profile
        </button>
        <button className="px-4 py-2 border border-[#0B4B54] text-[#0B4B54] rounded-lg font-medium hover:bg-[#0B4B54]/5 transition">
          Contact
        </button>
      </div>
    </div>
  );
};

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch all workers
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/helper/workers");

      if (response.data.success) {
        setWorkers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter workers based on search and availability
  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      searchQuery === "" ||
      worker.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.profile?.skillCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.profile?.location?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "available" && worker.profile?.isAvailable) ||
      (filter === "verified" && worker.isVerified);

    return matchesSearch && matchesFilter;
  });

  return (
    <HirerLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#032A33] mb-2">Browse Workers</h1>
          <p className="text-[#888888]">Find and connect with verified workers for your shifts</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-[#82ACAB]/20">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                placeholder="Search by name, skill, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#82ACAB]/30 focus:outline-none focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/10 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "all"
                    ? "bg-[#0B4B54] text-white"
                    : "bg-[#D3E4E7] text-[#032A33] hover:bg-[#82ACAB]/30"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("available")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "available"
                    ? "bg-[#0B4B54] text-white"
                    : "bg-[#D3E4E7] text-[#032A33] hover:bg-[#82ACAB]/30"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setFilter("verified")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === "verified"
                    ? "bg-[#0B4B54] text-white"
                    : "bg-[#D3E4E7] text-[#032A33] hover:bg-[#82ACAB]/30"
                }`}
              >
                <Shield size={16} className="inline mr-1" />
                Verified
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-[#888888]">
            Showing <span className="font-semibold text-[#032A33]">{filteredWorkers.length}</span> worker
            {filteredWorkers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Workers List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#0B4B54] mx-auto" />
            <p className="text-[#888888] mt-4">Loading workers...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#82ACAB]/20">
            <Briefcase size={64} className="text-[#82ACAB] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#032A33] mb-2">No Workers Found</h3>
            <p className="text-[#888888]">
              {searchQuery || filter !== "all"
                ? "Try adjusting your search or filters"
                : "No workers have registered yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker, index) => (
              <WorkerCard key={worker._id} worker={worker} delay={index * 50} />
            ))}
          </div>
        )}
      </div>
    </HirerLayout>
  );
}
